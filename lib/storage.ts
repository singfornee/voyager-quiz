import { nanoid } from "nanoid"

// Type for profile data
export interface ProfileData {
  profileName: string
  traits: string[]
  animal: { name: string; reason: string }
  groupRole: string
  superpower: string
  recommendedCities: Array<{
    name: string
    country: string
    reason: string
  }>
  mbtiAnalysis: {
    overview: string
    strengths: string[]
    challenges: string[]
    travelStyle: string
    idealCompanions: string
    growthAreas: string
  }
  answers: number[]
  createdAt: string
}

// In-memory storage for development/preview environments
const memoryStorage = new Map<string, ProfileData>()

// Check if Vercel KV is available
const isKVAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// Storage adapter that uses KV when available, falls back to memory storage
export const storage = {
  async set(key: string, value: any): Promise<void> {
    if (isKVAvailable()) {
      // Use Vercel KV if available
      const { kv } = await import("@vercel/kv")
      await kv.set(key, value)
    } else {
      // Fall back to in-memory storage
      memoryStorage.set(key, value)
    }
  },

  async get<T>(key: string): Promise<T | null> {
    if (isKVAvailable()) {
      // Use Vercel KV if available
      const { kv } = await import("@vercel/kv")
      return await kv.get<T>(key)
    } else {
      // Fall back to in-memory storage
      return (memoryStorage.get(key) as T) || null
    }
  },

  async delete(key: string): Promise<void> {
    if (isKVAvailable()) {
      // Use Vercel KV if available
      const { kv } = await import("@vercel/kv")
      await kv.del(key)
    } else {
      // Fall back to in-memory storage
      memoryStorage.delete(key)
    }
  },

  // Generate a unique ID for profiles
  generateId(): string {
    return nanoid(10)
  },
}
