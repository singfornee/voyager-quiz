"use server"

// Function to fetch images from Unsplash
export async function getUnsplashImage(query: string, width = 600, height = 400) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn("Unsplash API key not found, using placeholder image")
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      // Get the regular sized image and add width/height parameters
      const imageUrl = new URL(data.results[0].urls.regular)
      imageUrl.searchParams.set("w", width.toString())
      imageUrl.searchParams.set("h", height.toString())
      imageUrl.searchParams.set("fit", "crop")

      return imageUrl.toString()
    } else {
      console.warn(`No Unsplash results for query: ${query}`)
      return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error)
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }
}
