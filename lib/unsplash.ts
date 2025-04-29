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

    // Properly encode the query parameter for international characters including Mandarin
    const encodedQuery = encodeURIComponent(query)

    console.log(`Fetching Unsplash image for query: ${query} (encoded: ${encodedQuery})`)

    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

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
    const imagePromises = cities.map(async (city, index) => {
      try {
        // Create different queries for each city to avoid duplicate images
        // For Chinese cities, add English keywords to help Unsplash find relevant images
        const cityName = city.name
        const countryName = city.country

        // Create a unique query for each city with additional keywords
        let query
        if (index === 0) {
          query = `${cityName} ${countryName} skyline cityscape`
        } else if (index === 1) {
          query = `${cityName} ${countryName} landmark city`
        } else {
          query = `${cityName} ${countryName} travel destination`
        }

        // Add English translation for common Chinese city names to improve results
        const chineseToEnglish: Record<string, string> = {
          紐奧良: "New Orleans",
          巴塞隆納: "Barcelona",
          曼谷: "Bangkok",
          東京: "Tokyo",
          京都: "Kyoto",
          首爾: "Seoul",
          上海: "Shanghai",
          北京: "Beijing",
          香港: "Hong Kong",
          台北: "Taipei",
          巴黎: "Paris",
          倫敦: "London",
          羅馬: "Rome",
          威尼斯: "Venice",
          阿姆斯特丹: "Amsterdam",
          柏林: "Berlin",
          維也納: "Vienna",
          布拉格: "Prague",
          悉尼: "Sydney",
          墨爾本: "Melbourne",
          紐約: "New York",
          舊金山: "San Francisco",
          洛杉磯: "Los Angeles",
          西雅圖: "Seattle",
          溫哥華: "Vancouver",
          多倫多: "Toronto",
          蒙特婁: "Montreal",
          里約熱內盧: "Rio de Janeiro",
          布宜諾斯艾利斯: "Buenos Aires",
          開普敦: "Cape Town",
          杜拜: "Dubai",
          伊斯坦堡: "Istanbul",
          莫斯科: "Moscow",
          聖彼得堡: "Saint Petersburg",
          雅典: "Athens",
          馬德里: "Madrid",
          巴塞羅那: "Barcelona",
          里斯本: "Lisbon",
          阿姆斯特丹: "Amsterdam",
          布魯塞爾: "Brussels",
          慕尼黑: "Munich",
          蘇黎世: "Zurich",
          日內瓦: "Geneva",
          奧斯陸: "Oslo",
          斯德哥爾摩: "Stockholm",
          赫爾辛基: "Helsinki",
          哥本哈根: "Copenhagen",
          布達佩斯: "Budapest",
          華沙: "Warsaw",
          布拉格: "Prague",
          維也納: "Vienna",
          雅加達: "Jakarta",
          吉隆坡: "Kuala Lumpur",
          新加坡: "Singapore",
          馬尼拉: "Manila",
          河內: "Hanoi",
          胡志明市: "Ho Chi Minh City",
          金邊: "Phnom Penh",
          仰光: "Yangon",
          加德滿都: "Kathmandu",
          德里: "Delhi",
          孟買: "Mumbai",
          加爾各答: "Kolkata",
          班加羅爾: "Bangalore",
          開羅: "Cairo",
          內羅畢: "Nairobi",
          約翰內斯堡: "Johannesburg",
          卡薩布蘭卡: "Casablanca",
          伊斯坦堡: "Istanbul",
          安卡拉: "Ankara",
          特拉維夫: "Tel Aviv",
          耶路撒冷: "Jerusalem",
          貝魯特: "Beirut",
          阿布達比: "Abu Dhabi",
          多哈: "Doha",
          利雅得: "Riyadh",
          德黑蘭: "Tehran",
          巴格達: "Baghdad",
          大馬士革: "Damascus",
          安曼: "Amman",
          開羅: "Cairo",
          亞歷山大: "Alexandria",
          突尼斯: "Tunis",
          阿爾及爾: "Algiers",
          卡薩布蘭卡: "Casablanca",
          拉巴特: "Rabat",
          的黎波里: "Tripoli",
          班加西: "Benghazi",
          喀土穆: "Khartoum",
          亞的斯亞貝巴: "Addis Ababa",
          內羅畢: "Nairobi",
          達累斯薩拉姆: "Dar es Salaam",
          金沙薩: "Kinshasa",
          拉各斯: "Lagos",
          阿克拉: "Accra",
          阿比讓: "Abidjan",
          達喀爾: "Dakar",
          蒙羅維亞: "Monrovia",
          弗里敦: "Freetown",
          科納克里: "Conakry",
          巴馬科: "Bamako",
          瓦加杜古: "Ouagadougou",
          尼亞美: "Niamey",
          恩賈梅納: "N'Djamena",
          班吉: "Bangui",
          雅溫得: "Yaoundé",
          利伯維爾: "Libreville",
          布拉柴維爾: "Brazzaville",
          盧安達: "Luanda",
          溫得和克: "Windhoek",
          哈拉雷: "Harare",
          馬普托: "Maputo",
          安塔那那利佛: "Antananarivo",
          維多利亞: "Victoria",
          路易港: "Port Louis",
          聖丹尼: "Saint-Denis",
          莫羅尼: "Moroni",
          多多馬: "Dodoma",
          坎帕拉: "Kampala",
          基加利: "Kigali",
          布瓊布拉: "Bujumbura",
          朱巴: "Juba",
          摩加迪沙: "Mogadishu",
          吉布提: "Djibouti",
          阿斯馬拉: "Asmara",
          亞的斯亞貝巴: "Addis Ababa",
        }

        // If we have an English translation for this city, add it to the query
        if (chineseToEnglish[cityName]) {
          query = `${chineseToEnglish[cityName]} ${query}`
        }

        console.log(`Fetching image for city ${index + 1}: ${cityName}, ${countryName} with query: ${query}`)

        // Add a random number to ensure we get different images
        const randomSeed = Math.floor(Math.random() * 1000)
        const imageUrl = await getUnsplashImage(`${query} ${randomSeed}`, 600, 400)

        return {
          url: imageUrl,
          query,
          city: cityName,
          country: countryName,
        }
      } catch (err) {
        console.error(`Error fetching image for ${city.name}:`, err)
        return {
          url: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(`${city.name} ${city.country}`)}`,
          query: `${city.name} ${city.country}`,
          city: city.name,
          country: city.country,
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
      city: city.name,
      country: city.country,
    }))
  }
}
