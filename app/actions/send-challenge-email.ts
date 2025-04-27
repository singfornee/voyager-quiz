"use server"

import { Resend } from "resend"

// Initialize Resend with your API key
// In production, you would use an environment variable
const resend = new Resend(process.env.RESEND_API_KEY || "test_api_key")

// Helper function to get emoji based on traveler type
function getTravelerEmoji(type: string): string {
  const typeEmojis: Record<string, string> = {
    "Adventurous Explorer": "🧗‍♀️",
    "Cultural Nomad": "🏛️",
    "Luxury Traveler": "💎",
    "Digital Explorer": "💻",
    "Urban Adventurer": "🏙️",
    "Beach Bum": "🏝️",
    Backpacker: "🎒",
    "Foodie Traveler": "🍜",
    "Aesthetic Adventurer": "📸",
    "Social Explorer": "🤝",
    "Luxury Nomad": "🧳",
  }
  return typeEmojis[type] || "✈️"
}

export async function sendChallengeEmails(formData: FormData) {
  const senderEmail = formData.get("senderEmail") as string
  const senderName = (formData.get("senderName") as string) || "A friend"
  const travelerType = formData.get("travelerType") as string
  const recipientEmails = formData.getAll("recipientEmail") as string[]

  // Filter out empty emails
  const validEmails = recipientEmails.filter((email) => email && email.trim() !== "" && email.includes("@"))

  if (validEmails.length === 0) {
    return {
      success: false,
      message: "No valid email addresses provided",
    }
  }

  try {
    // Check if we have a Resend API key
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "test_api_key") {
      console.log("Missing Resend API key, using development mode fallback")

      // Log the emails that would be sent in development mode
      console.log(`[DEV MODE] Would send challenge emails to: ${validEmails.join(", ")}`)
      console.log(`[DEV MODE] From: ${senderName} (${senderEmail})`)
      console.log(`[DEV MODE] Traveler type: ${travelerType}`)

      // Simulate successful sending in development mode
      return {
        success: true,
        message: `Challenge sent to ${validEmails.length} friend${validEmails.length > 1 ? "s" : ""}!`,
        isDevelopmentMode: true,
      }
    }

    // In production with a valid API key, send actual emails
    const results = await Promise.all(
      validEmails.map(async (email) => {
        return resend.emails.send({
          from: "Voyager AI <challenge@voyagerai.io>",
          to: email,
          subject: `${senderName} challenged you to discover your travel style!`,
          html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Style Challenge</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333333;
        line-height: 1.6;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .email-header {
        background: linear-gradient(to right, #8b5cf6, #ec4899);
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .email-content {
        padding: 30px 20px;
      }
      .email-footer {
        background-color: #f3f4f6;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .emoji {
        font-size: 36px;
        margin-bottom: 10px;
      }
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      }
      .subtitle {
        margin-top: 5px;
        opacity: 0.9;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(to right, #8b5cf6, #ec4899);
        color: white;
        text-decoration: none;
        padding: 14px 30px;
        border-radius: 8px;
        font-weight: bold;
        margin: 25px 0;
        text-align: center;
        box-shadow: 0 4px 6px rgba(139, 92, 246, 0.25);
      }
      .highlight {
        font-weight: bold;
        color: #8b5cf6;
      }
      .divider {
        height: 1px;
        background-color: #e5e7eb;
        margin: 25px 0;
      }
      .social-links {
        margin-top: 15px;
      }
      .social-links a {
        color: #8b5cf6;
        text-decoration: none;
        margin: 0 10px;
      }
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100%;
          border-radius: 0;
        }
        .email-header, .email-content {
          padding: 20px 15px;
        }
        h1 {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <div class="logo">✨ Voyager AI</div>
        <div class="emoji">${getTravelerEmoji(travelerType)}</div>
        <h1>Travel Style Challenge!</h1>
        <p class="subtitle">Discover your unique travel personality</p>
      </div>
      
      <div class="email-content">
        <p>Hey there!</p>
        
        <p><span class="highlight">${senderName}</span> has discovered they're a <span class="highlight">${travelerType}</span> and wants to see what type of traveler you are!</p>
        
        <p>This fun 1-minute quiz will reveal your travel personality, recommend destinations that match your style, and provide personalized travel hacks.</p>
        
        <div style="text-align: center;">
          <a href="https://play.voyagerai.io" class="cta-button">Take the Quiz Now</a>
        </div>
        
        <p>What will your result be? A Cultural Nomad? A Luxury Traveler? An Adventurous Explorer? There's only one way to find out!</p>
        
        <div class="divider"></div>
        
        <p style="font-size: 14px;">P.S. After you take the quiz, you can challenge your friends too!</p>
      </div>
      
      <div class="email-footer">
        <p>Powered by <a href="https://voyagerai.io" style="color: #8b5cf6; text-decoration: none;">Voyager AI</a></p>
        <p>This email was sent because ${senderName} invited you to take the travel style quiz.</p>
        <div class="social-links">
          <a href="https://twitter.com/voyagerai">Twitter</a> • 
          <a href="https://instagram.com/voyagerai">Instagram</a>
        </div>
      </div>
    </div>
  </body>
  </html>
`,
        })
      }),
    )

    return {
      success: true,
      message: `Challenge sent to ${validEmails.length} friend${validEmails.length > 1 ? "s" : ""}!`,
    }
  } catch (error) {
    console.error("Error sending challenge emails:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
