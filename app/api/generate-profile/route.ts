import { type NextRequest, NextResponse } from "next/server"
import { generateProfile } from "@/lib/generate-profile"

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers) || answers.length !== 6) {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 })
    }

    const profileId = await generateProfile(answers)

    return NextResponse.json({ success: true, profileId })
  } catch (error) {
    console.error("Profile generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate profile" },
      { status: 500 },
    )
  }
}
