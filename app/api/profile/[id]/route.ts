import { type NextRequest, NextResponse } from "next/server"
import { storage, type ProfileData } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profileData = await storage.get<ProfileData>(`profile:${params.id}`)

    if (!profileData) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    )
  }
}
