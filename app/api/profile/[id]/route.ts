import { NextResponse } from "next/server"
import { storage } from "@/lib/storage"

export async function GET(request, { params }) {
  // Add cache headers
  const response = NextResponse.json(await storage.get(`profile:${params.id}`))
  response.headers.set("Cache-Control", "public, max-age=3600")
  return response
}
