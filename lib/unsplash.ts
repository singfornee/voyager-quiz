"use server"

// Function to fetch images from Unsplash with improved error handling
export async function getUnsplashImage(query: string, width = 600, height = 400): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn("Unsplash API key not found, using placeholder image")
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }

  try {
    // Add a timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        signal: controller.signal,
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    )

    clearTimeout(timeoutId)

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
      imageUrl.searchParams.set("q", "80") // Reduce quality slightly for faster loading

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

// Function to fetch multiple images in parallel with improved reliability
export async function fetchCityImages(cities: Array<{ name: string; country: string }>) {
  try {
    const imagePromises = cities.map(async (city) => {
      try {
        const query = `${city.name} ${city.country} cityscape`
        const imageUrl = await getUnsplashImage(query, 600, 400)
        return { url: imageUrl, query }
      } catch (err) {
        console.error(`Error fetching image for ${city.name}:`, err)
        return {
          url: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(`${city.name} ${city.country}`)}`,
          query: `${city.name} ${city.country}`,
        }
      }
    })

    return Promise.all(imagePromises)
  } catch (error) {
    console.error("Error fetching city images:", error)
    // Return fallback images if there's an error
    return cities.map((city) => ({
      url: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(`${city.name} ${city.country}`)}`,
      query: `${city.name} ${city.country}`,
    }))
  }
}
