"use server"

// Function to fetch images from Unsplash with improved error handling
export async function getUnsplashImage(query: string, width = 600, height = 400): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn("Unsplash API key not found, using placeholder image")
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }

  try {
    // Translate Chinese city names to English for better search results
    const searchQuery = translateCityNameIfNeeded(query)
    console.log(`Searching Unsplash for: ${searchQuery} (original: ${query})`)

    // Add a timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1`,
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
      console.warn(`No Unsplash results for query: ${searchQuery}`)
      return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error)
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }
}

// Function to translate common Chinese city names to English
function translateCityNameIfNeeded(query: string): string {
  // Common Chinese city and country name translations
  const translations: Record<string, string> = {
    // Cities
    羅馬: "Rome",
    京都: "Kyoto",
    里約熱內盧: "Rio de Janeiro",
    東京: "Tokyo",
    巴黎: "Paris",
    倫敦: "London",
    紐約: "New York",
    香港: "Hong Kong",
    北京: "Beijing",
    上海: "Shanghai",
    台北: "Taipei",
    曼谷: "Bangkok",
    新加坡: "Singapore",
    雅典: "Athens",
    威尼斯: "Venice",
    佛羅倫斯: "Florence",
    馬德里: "Madrid",
    巴塞隆納: "Barcelona",
    阿姆斯特丹: "Amsterdam",
    柏林: "Berlin",
    維也納: "Vienna",
    布拉格: "Prague",
    悉尼: "Sydney",
    墨爾本: "Melbourne",
    開普敦: "Cape Town",
    杜拜: "Dubai",
    伊斯坦堡: "Istanbul",
    莫斯科: "Moscow",
    聖彼得堡: "Saint Petersburg",

    // Countries
    義大利: "Italy",
    日本: "Japan",
    巴西: "Brazil",
    法國: "France",
    英國: "England",
    美國: "USA",
    中國: "China",
    台灣: "Taiwan",
    泰國: "Thailand",
    希臘: "Greece",
    西班牙: "Spain",
    荷蘭: "Netherlands",
    德國: "Germany",
    奧地利: "Austria",
    捷克: "Czech Republic",
    澳洲: "Australia",
    南非: "South Africa",
    阿聯酋: "UAE",
    土耳其: "Turkey",
    俄羅斯: "Russia",
  }

  // Check if the query contains any Chinese city or country names
  for (const [chinese, english] of Object.entries(translations)) {
    if (query.includes(chinese)) {
      // Replace the Chinese name with English
      return query.replace(chinese, english)
    }
  }

  return query
}

// Function to fetch multiple images in parallel with improved reliability
export async function fetchCityImages(cities: Array<{ name: string; country: string }>) {
  try {
    const imagePromises = cities.map(async (city) => {
      try {
        // Create a search query that works well with Unsplash
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
