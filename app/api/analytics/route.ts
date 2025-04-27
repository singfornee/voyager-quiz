import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import fs from "fs"
import path from "path"

// Analytics keys
const EVENTS_KEY = "voyager:analytics:events"
const MIGRATION_KEY = "voyager:analytics:migration:completed"

// Fallback file storage for local development
const DATA_DIR = path.join(process.cwd(), "data")
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics-data.json")

// In-memory fallback when both KV and file storage fail
const inMemoryEvents: any[] = []

// Check if Vercel KV is available
const isKVAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

// Helper to check if KV is working
async function isKVWorking() {
  if (!isKVAvailable) return false

  try {
    // Try a simple operation to verify KV is working
    await kv.ping()
    return true
  } catch (error) {
    console.warn("KV is configured but not working:", error)
    return false
  }
}

// Initialize the data directory and file for fallback storage
function initAnalyticsFile() {
  try {
    // Create the data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Create the analytics file if it doesn't exist
    if (!fs.existsSync(ANALYTICS_FILE)) {
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ events: [] }), "utf8")
    }

    // Verify the file is valid JSON
    try {
      const data = fs.readFileSync(ANALYTICS_FILE, "utf8")
      JSON.parse(data)
    } catch (e) {
      // If the file exists but isn't valid JSON, reset it
      console.warn("Analytics file was corrupted, resetting it")
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ events: [] }), "utf8")
    }

    return true
  } catch (error) {
    console.error("Failed to initialize analytics file:", error)
    return false
  }
}

// Read analytics data from file (fallback method)
function readAnalyticsFile() {
  try {
    if (!initAnalyticsFile()) {
      return { events: [] }
    }

    const data = fs.readFileSync(ANALYTICS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading analytics file:", error)
    return { events: [] }
  }
}

// Write analytics data to file (fallback method)
function writeAnalyticsFile(data: any) {
  try {
    if (!initAnalyticsFile()) {
      return false
    }

    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error writing analytics file:", error)
    return false
  }
}

// Migrate data from file to KV
async function migrateFileDataToKV() {
  try {
    // Check if we've already migrated
    const migrationCompleted = await kv.get(MIGRATION_KEY)
    if (migrationCompleted) return true

    // Read data from file
    const fileData = readAnalyticsFile()

    if (fileData && fileData.events && fileData.events.length > 0) {
      console.log(`Migrating ${fileData.events.length} events from file to KV...`)

      // Store each event in KV
      for (const event of fileData.events) {
        await kv.lpush(EVENTS_KEY, event)
      }

      console.log(`Successfully migrated ${fileData.events.length} events to KV`)

      // Mark migration as completed
      await kv.set(MIGRATION_KEY, true)
      return true
    }

    // No data to migrate, but mark as completed
    await kv.set(MIGRATION_KEY, true)
    return true
  } catch (error) {
    console.error("Error migrating data to KV:", error)
    return false
  }
}

// Store analytics event using the best available method
async function storeAnalyticsEvent(event: any) {
  // Try KV first if available
  if (await isKVWorking()) {
    try {
      await kv.lpush(EVENTS_KEY, event)
      return { success: true, method: "kv" }
    } catch (error) {
      console.warn("KV storage failed, falling back to file storage:", error)
    }
  }

  // Fall back to file storage
  try {
    const data = readAnalyticsFile()
    data.events.push(event)
    const success = writeAnalyticsFile(data)

    if (success) {
      return { success: true, method: "file" }
    }

    // If file storage fails, use in-memory as last resort
    inMemoryEvents.push(event)
    console.warn("Using in-memory storage as last resort")
    return { success: true, method: "memory" }
  } catch (error) {
    // Last resort: in-memory storage
    inMemoryEvents.push(event)
    console.warn("Using in-memory storage as last resort:", error)
    return { success: true, method: "memory" }
  }
}

// Get analytics events using the best available method
async function getAnalyticsEvents() {
  // Try KV first if available
  if (await isKVWorking()) {
    try {
      // Try to migrate data if not already done
      await migrateFileDataToKV()

      // Get events from KV (most recent 1000)
      const events = await kv.lrange(EVENTS_KEY, 0, 999)

      if (events && events.length > 0) {
        return { events, method: "kv" }
      }
    } catch (error) {
      console.warn("KV retrieval failed, falling back to file storage:", error)
    }
  }

  // Fall back to file storage
  try {
    const data = readAnalyticsFile()
    if (data.events && data.events.length > 0) {
      return { ...data, method: "file" }
    }
  } catch (error) {
    console.warn("File retrieval failed, falling back to in-memory storage:", error)
  }

  // Last resort: in-memory storage
  return { events: inMemoryEvents, method: "memory" }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json()

    // Add the new event with a timestamp
    const newEvent = {
      ...eventData,
      timestamp: eventData.timestamp || new Date().toISOString(),
      serverTimestamp: new Date().toISOString(),
    }

    // Store the event using the best available method
    const { success, method } = await storeAnalyticsEvent(newEvent)

    return NextResponse.json({ success, method })
  } catch (error) {
    console.error("Analytics POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to store analytics" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get events using the best available method
    const { events, method } = await getAnalyticsEvents()

    // Create response with storage method header
    const response = NextResponse.json({ events })
    response.headers.set("X-Storage-Type", method)

    return response
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to read analytics", events: [] }, { status: 500 })
  }
}
