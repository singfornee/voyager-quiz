import { type NextRequest, NextResponse } from "next/server"
import { subscribeToMailchimp } from "@/lib/mailchimp"

export async function POST(request: NextRequest) {
  try {
    const { email, name, profileType } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const result = await subscribeToMailchimp(email, name, profileType)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Mailchimp API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to subscribe" }, { status: 500 })
  }
}
