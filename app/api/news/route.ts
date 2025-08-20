import { type NextRequest, NextResponse } from "next/server"
import { fetchMultiplePages } from "@/lib/news-api"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters = {
      topic: searchParams.get("topic") || "general",
      country: searchParams.get("country") || "us",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      searchQuery: searchParams.get("q") || "",
    }

    const newsData = await fetchMultiplePages(filters, 3)

    return NextResponse.json(newsData)
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
