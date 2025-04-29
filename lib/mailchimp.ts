"use server"

import crypto from "crypto"

export async function subscribeToMailchimp(email: string, name: string, profileType: string) {
  // This is a placeholder for the Mailchimp API integration
  // You'll need to add your Mailchimp API key as an environment variable

  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_AUDIENCE_ID || !process.env.MAILCHIMP_API_SERVER) {
    throw new Error("Mailchimp configuration is missing")
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const apiServer = process.env.MAILCHIMP_API_SERVER

  // Create MD5 hash of lowercase email for Mailchimp
  const emailHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex")

  const url = `https://${apiServer}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}`

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: name.split(" ")[0] || "",
      LNAME: name.split(" ").slice(1).join(" ") || "",
      PROFILE: profileType,
    },
    tags: ["VoyaBear Beta", `Profile: ${profileType}`],
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.title || "Failed to subscribe to newsletter")
    }

    return await response.json()
  } catch (error) {
    console.error("Mailchimp subscription error:", error)
    throw error
  }
}
