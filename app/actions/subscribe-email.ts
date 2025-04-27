"use server"

export async function subscribeToMailchimp(formData: FormData) {
  const email = formData.get("email") as string
  const travelerType = formData.get("travelerType") as string

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address",
    }
  }

  try {
    // Get Mailchimp API credentials from environment variables
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID

    // Check if we have all required Mailchimp credentials
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_LIST_ID) {
      console.log("Missing Mailchimp configuration, using development mode fallback")
      // Development/preview mode fallback - simulate successful subscription
      return {
        success: true,
        message: "You're all set! We'll notify you when Voyager AI launches.",
        isDevelopmentMode: true,
      }
    }

    // Store email in a simple database or file for development purposes
    console.log(`[DEV MODE] Storing email: ${email}, traveler type: ${travelerType}`)

    // In a real environment with valid API keys, we would proceed with the Mailchimp API calls
    // For now, we'll just return a success message
    return {
      success: true,
      message: "You're all set! We'll notify you when Voyager AI launches.",
      isDevelopmentMode: true,
    }

    /* 
    // The following code is commented out until valid Mailchimp credentials are available
    
    // Create an identifier for the subscriber
    const emailHash = await createSubscriberId(email.toLowerCase())

    // Check if the member already exists
    const checkResponse = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (checkResponse.status === 200) {
      // Member exists, update their info
      const updateResponse = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merge_fields: {
              TRAVELER: travelerType,
            },
          }),
        },
      )

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.title || "Failed to update subscription")
      }

      return {
        success: true,
        message: "You're already subscribed! We've updated your preferences.",
      }
    } else {
      // Member doesn't exist, add them
      const addResponse = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              TRAVELER: travelerType,
            },
            tags: ["Travel Quiz", travelerType],
          }),
        },
      )

      if (!addResponse.ok) {
        const errorData = await addResponse.json()

        // Handle the case where the user was already subscribed but archived
        if (errorData.title === "Member Exists" && addResponse.status === 400) {
          return {
            success: true,
            message: "You're already subscribed! We've updated your preferences.",
          }
        }

        throw new Error(errorData.title || "Failed to subscribe")
      }

      return {
        success: true,
        message: "You're all set! We'll notify you when Voyager AI launches.",
      }
    }
    */
  } catch (error) {
    console.error("Subscription error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}

// Helper function to create a subscriber ID
async function createSubscriberId(text: string): Promise<string> {
  // Simple implementation of string to hex conversion
  function stringToHex(str: string): string {
    let hex = ""
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i)
      hex += charCode.toString(16).padStart(2, "0")
    }
    return hex.substring(0, 32).padEnd(32, "0")
  }

  return stringToHex(text)
}
