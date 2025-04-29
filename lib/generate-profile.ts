"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { storage } from "./storage"

// Map answers to profile types based on the new questions
// The mapping is now more complex as the options don't directly map to specific types
// We'll use a more nuanced approach in the profile generation
type ProfileType = "relaxed" | "explorer" | "cultural" | "luxury" | "foodie" | "adventurer"

// Helper function to extract JSON from a string that might contain markdown code blocks
function extractJSON(text: string): string {
  // Check if the text contains a markdown code block
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = text.match(jsonRegex)

  if (match && match[1]) {
    // Return the content inside the code block
    return match[1].trim()
  }

  // If no code block is found, return the original text
  return text.trim()
}

// Add caching for similar answer patterns
export async function generateProfile(answers: number[]): Promise<string> {
  // Generate a cache key based on answers
  const cacheKey = `profile:cache:${answers.join("")}`

  // Check if we have a cached result
  const cachedProfile = await storage.get<string>(cacheKey)
  if (cachedProfile) {
    return cachedProfile
  }

  // Create a more detailed analysis of the answers
  // This helps the AI understand the nuances of the user's preferences
  const answerAnalysis = [
    // Question 1: Which of the following would you choose?
    answers[0] === 0
      ? "Prefers relaxation with no schedule (palm tree)"
      : answers[0] === 1
        ? "Enjoys exploring hidden streets and trails"
        : answers[0] === 2
          ? "Loves museums, guided tours, and history"
          : "Appreciates luxury stays, fine dining, and scenic views",

    // Question 2: First 24 hours in a new city
    answers[1] === 0
      ? "Seeks authentic local food experiences"
      : answers[1] === 1
        ? "Explores spontaneously without a plan"
        : answers[1] === 2
          ? "Prioritizes top-rated attractions"
          : "Values comfort and enjoying accommodations",

    // Question 3: Travel trophy
    answers[2] === 0
      ? "Proud of physical achievements like summiting volcanoes"
      : answers[2] === 1
        ? "Values nature experiences like swimming with wildlife"
        : answers[2] === 2
          ? "Treasures cultural experiences and festivals"
          : "Appreciates unique accommodations with historical significance",

    // Question 4: Magical backpack item
    answers[3] === 0
      ? "Values personal space and comfort (headphones)"
      : answers[3] === 1
        ? "Prepared for outdoor adventures (trail shoes)"
        : answers[3] === 2
          ? "Focused on capturing memories (camera)"
          : "Appreciates planning and organization",

    // Question 5: $1,000 spending
    answers[4] === 0
      ? "Prioritizes food experiences"
      : answers[4] === 1
        ? "Values exclusive relaxing experiences"
        : answers[4] === 2
          ? "Enjoys shopping for unique local items"
          : "Seeks adventure activities and tours",

    // Question 6: Last night vibe
    answers[5] === 0
      ? "Ends trips with relaxation and recharging"
      : answers[5] === 1
        ? "Seeks adventure until the very end"
        : answers[5] === 2
          ? "Values cultural experiences to close the trip"
          : "Appreciates upscale experiences and celebration",
  ]

  // Identify primary travel motivations based on the pattern of answers
  const motivations = {
    relaxation:
      (answers[0] === 0 ? 2 : 0) + (answers[1] === 3 ? 1 : 0) + (answers[4] === 1 ? 1 : 0) + (answers[5] === 0 ? 2 : 0),
    adventure:
      (answers[0] === 1 ? 1 : 0) +
      (answers[2] === 0 ? 2 : 0) +
      (answers[3] === 1 ? 1 : 0) +
      (answers[4] === 3 ? 2 : 0) +
      (answers[5] === 1 ? 2 : 0),
    culture:
      (answers[0] === 2 ? 2 : 0) +
      (answers[2] === 2 ? 2 : 0) +
      (answers[2] === 3 ? 1 : 0) +
      (answers[4] === 2 ? 1 : 0) +
      (answers[5] === 2 ? 2 : 0),
    luxury:
      (answers[0] === 3 ? 2 : 0) + (answers[1] === 3 ? 2 : 0) + (answers[4] === 1 ? 1 : 0) + (answers[5] === 3 ? 2 : 0),
    food: (answers[1] === 0 ? 2 : 0) + (answers[4] === 0 ? 2 : 0),
    nature: (answers[2] === 1 ? 2 : 0) + (answers[3] === 1 ? 1 : 0) + (answers[4] === 3 ? 1 : 0),
    spontaneity: (answers[0] === 1 ? 1 : 0) + (answers[1] === 1 ? 2 : 0) + (answers[5] === 1 ? 1 : 0),
    planning: (answers[3] === 3 ? 2 : 0) + (answers[1] === 2 ? 1 : 0),
  }

  // Find the top two motivations
  let primaryMotivation = "balanced"
  let secondaryMotivation = "balanced"
  let maxScore = 0
  let secondMaxScore = 0

  Object.entries(motivations).forEach(([motivation, score]) => {
    if (score > maxScore) {
      secondMaxScore = maxScore
      secondaryMotivation = primaryMotivation
      maxScore = score
      primaryMotivation = motivation
    } else if (score > secondMaxScore) {
      secondMaxScore = score
      secondaryMotivation = motivation
    }
  })

  // Add a uniqueness factor based on the specific pattern of answers
  // This creates a unique fingerprint for each answer combination
  const answerFingerprint = answers.join("")

  // Generate a seed based on the answers to ensure different prompts
  const seed = answers.reduce((acc, val, idx) => acc + val * (idx + 1), 0)

  // Generate profile using OpenAI
  const prompt = `
  Create a fun travel personality profile based on these quiz answers:
  
  Answer pattern: ${answerFingerprint}
  Answer analysis: 
  ${answerAnalysis.join("\n")}
  
  Primary travel motivation: ${primaryMotivation}
  Secondary travel motivation: ${secondaryMotivation}
  Uniqueness seed: ${seed}
  
  IMPORTANT TONE INSTRUCTIONS:
  - Use simple, everyday language - like a friend talking to a friend
  - Be a bit funny but not trying too hard
  - Sound like a real person, not a textbook
  - Keep sentences short and easy to read
  - Use casual words instead of fancy ones
  - Be straightforward but with personality
  
  IMPORTANT CONTENT INSTRUCTIONS:
  - Make the profile feel balanced and nuanced, not stereotypical
  - Acknowledge that people are complex and may have aspects of different travel styles
  - Focus on the primary motivation but incorporate elements of the secondary motivation
  - Make the profile feel personalized to their specific answer pattern
  - Avoid making the profile feel too extreme or one-dimensional
  - Use the emojis from their answers to personalize the profile where appropriate
  
  The profile should include:
  1. A catchy name for this travel personality (like "Sunset Seeker" or "Cultural Connoisseur") - make it unique based on their answers
  2. 3-5 personality traits that sum them up
  3. Fun insights:
     - What animal are they like when traveling and why? (Keep it simple and fun)
     - What job would they have in a friend group trip? (Like "The one who finds the best food spots" or "The one who always knows where the bathroom is")
     - What's their travel superpower? (A special skill they have when traveling)
  4. 3 cities they'd love and why they'd click with each place
  5. A breakdown of their travel personality:
     - A couple short paragraphs about how they travel (keep it super casual)
     - 3-4 things they're great at when traveling
     - 2-3 things that might trip them up
     - How they make travel decisions
     - Who they should travel with
     - How they could grow as a traveler
  
  Format the response as JSON with the following structure:
  {
    "profileName": "Name of the profile",
    "traits": ["trait1", "trait2", "trait3"],
    "animal": {"name": "Animal name", "reason": "Reason why"},
    "groupRole": "Role in group (keep it short and fun)",
    "superpower": "Travel superpower (keep it short and fun)",
    "recommendedCities": [
      {"name": "City 1", "country": "Country", "reason": "Why it matches"},
      {"name": "City 2", "country": "Country", "reason": "Why it matches"},
      {"name": "City 3", "country": "Country", "reason": "Why it matches"}
    ],
    "mbtiAnalysis": {
      "overview": "2-3 paragraph overview of this personality type",
      "strengths": ["strength1", "strength2", "strength3"],
      "challenges": ["challenge1", "challenge2"],
      "travelStyle": "Description of travel style and decision-making",
      "idealCompanions": "Description of ideal travel companions",
      "growthAreas": "How this traveler can grow through travel experiences"
    }
  }
  
  FINAL REMINDERS: 
  - Create a UNIQUE profile based on their specific answers
  - Use simple words a middle schooler would understand
  - Write like you're texting a friend, not writing an essay
  - Be a little funny but natural about it
  - Vary sentence length to sound human
  - Return ONLY the JSON object with no markdown formatting, code blocks, or additional text.
`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: prompt,
      temperature: 0.9, // Increase temperature for more variety
    })

    // Extract JSON from the response and parse it
    const cleanedJsonText = extractJSON(text)

    try {
      // Parse the JSON response
      const profileData = JSON.parse(cleanedJsonText)

      // Generate a unique ID for this profile
      const profileId = storage.generateId()

      // Store the profile data
      await storage.set(`profile:${profileId}`, {
        ...profileData,
        answers,
        createdAt: new Date().toISOString(),
      })

      // Before returning profileId, cache the result
      await storage.set(cacheKey, profileId, { ex: 60 * 60 * 24 * 7 }) // Cache for a week

      return profileId
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      console.error("Raw text:", text)
      console.error("Cleaned text:", cleanedJsonText)
      throw new Error(`Failed to parse profile data: ${parseError.message}`)
    }
  } catch (error) {
    console.error("Error generating profile:", error)
    throw new Error(`Failed to generate travel profile: ${error.message}`)
  }
}
