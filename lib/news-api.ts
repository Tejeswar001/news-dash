import type { NewsResponse, NewsFilters } from "@/types/news"

const NEWS_API_BASE_URL = "https://newsapi.org/v2"

export async function fetchNews(filters: NewsFilters, page = 1): Promise<NewsResponse> {
  const { topic, country, startDate, endDate, searchQuery } = filters

  const params = new URLSearchParams()
  params.append("apiKey", process.env.NEWS_API_KEY!)

  const endpoint = "everything"

  // Build search query
  if (searchQuery) {
    params.append("q", searchQuery)
  } else if (topic && topic !== "general") {
    params.append("q", topic)
  } else {
    params.append("q", "breaking news OR world news OR international")
  }

  // Add date filters if provided
  if (startDate) {
    params.append("from", startDate)
  }

  if (endDate) {
    params.append("to", endDate)
  }

  params.append("pageSize", "60")
  params.append("page", page.toString())
  params.append("sortBy", "publishedAt")
  params.append("language", "en")

  // Add domain filtering for quality sources
  if (country === "all" || !country) {
    params.append(
      "domains",
      "bbc.com,reuters.com,cnn.com,aljazeera.com,theguardian.com,apnews.com,npr.org,wsj.com,nytimes.com",
    )
  }

  const url = `${NEWS_API_BASE_URL}/${endpoint}?${params.toString()}`

  console.log("News API URL:", url.replace(process.env.NEWS_API_KEY!, "***"))

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
  console.error("News API error response:", errorText)
    throw new Error(`News API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (data.status === "error") {
  console.error("News API returned error:", data.message)
    throw new Error(`News API error: ${data.message}`)
  }

  return data
}

export async function fetchMultiplePages(filters: NewsFilters, maxPages = 1): Promise<NewsResponse> {
  try {
    const response = await fetchNews(filters, 1)

    if (response.articles && response.articles.length > 0) {
      const limitedArticles = response.articles.slice(0, 50)

      return {
        status: "ok",
        totalResults: response.totalResults || 0,
        articles: limitedArticles,
      }
    }

    return response
  } catch (error) {
  console.error("Error fetching articles:", error)
    throw error
  }
}
