"use client"

import { useState, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { NewsFilters } from "@/components/news-filters"
import { NewsArticleCard } from "@/components/news-article-card"
import { AdvancedSearch } from "@/components/advanced-search"
import { SourcePieChart } from "@/components/charts/source-pie-chart"
import { SentimentAnalysisChart } from "@/components/charts/sentiment-analysis-chart"
import { CategoryBarChart } from "@/components/charts/category-bar-chart"
import { KeywordCloud } from "@/components/charts/keyword-cloud"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, Globe, BarChart3 } from "lucide-react"
import type { NewsArticle, NewsFilters as NewsFiltersType } from "@/types/news"
import { processArticlesForCharts } from "@/lib/chart-utils"

export default function DashboardPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [summaries, setSummaries] = useState<Record<string, string>>({})
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<"date" | "relevance" | "source">("date")
  const [filterBy, setFilterBy] = useState<"all" | "today" | "week" | "month">("all")
  const { toast } = useToast()

  const chartData = useMemo(() => {
    if (filteredArticles.length === 0) {
      return {
        sourceData: [],
        sentimentData: [],
        categoryData: [],
        keywordData: [],
      }
    }
    return processArticlesForCharts(filteredArticles)
  }, [filteredArticles])

  const fetchNews = async (filters: NewsFiltersType) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        topic: filters.topic,
        country: filters.country,
        startDate: filters.startDate,
        endDate: filters.endDate,
        q: filters.searchQuery || "",
      })

      const response = await fetch(`/api/news?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data = await response.json()
      setArticles(data.articles || [])
      setFilteredArticles(data.articles || [])

      toast({
        title: "News Updated",
        description: `Found ${data.articles?.length || 0} articles`,
      })
    } catch (error) {
      console.error("Error fetching news:", error)
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async (article: NewsArticle) => {
    const articleKey = article.url
    setSummarizing((prev) => ({ ...prev, [articleKey]: true }))

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          content: article.content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate summary")
      }

      const data = await response.json()
      setSummaries((prev) => ({
        ...prev,
        [articleKey]: data.summary,
      }))

      toast({
        title: "Summary Generated",
        description: "AI summary has been created for this article.",
      })
    } catch (error) {
      console.error("Error summarizing article:", error)
      toast({
        title: "Summarization Error",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setSummarizing((prev) => ({ ...prev, [articleKey]: false }))
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFiltersAndSort(term, sortBy, filterBy)
  }

  const applyFiltersAndSort = (searchTerm: string, sort: string, filter: string) => {
    let filtered = [...articles]

    // Apply search filter
    if (searchTerm.trim()) {
      const terms = searchTerm
        .toLowerCase()
        .split(" ")
        .filter((t) => t.length > 2)
      filtered = filtered.filter((article) => {
        const searchText = `${article.title} ${article.description || ""} ${article.source.name}`.toLowerCase()
        return terms.some((term) => searchText.includes(term)) || terms.every((term) => searchText.includes(term))
      })
    }

    // Apply date filter
    const now = new Date()
    if (filter === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      filtered = filtered.filter((article) => new Date(article.publishedAt) >= today)
    } else if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((article) => new Date(article.publishedAt) >= weekAgo)
    } else if (filter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((article) => new Date(article.publishedAt) >= monthAgo)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case "date":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "source":
          return a.source.name.localeCompare(b.source.name)
        case "relevance":
          // Simple relevance based on title length and description presence
          const scoreA = (a.title.length + (a.description?.length || 0)) / 100
          const scoreB = (b.title.length + (b.description?.length || 0)) / 100
          return scoreB - scoreA
        default:
          return 0
      }
    })

    setFilteredArticles(filtered)
  }

  const handleSortChange = (newSort: "date" | "relevance" | "source") => {
    setSortBy(newSort)
    applyFiltersAndSort(searchTerm, newSort, filterBy)
  }

  const handleFilterChange = (newFilter: "all" | "today" | "week" | "month") => {
    setFilterBy(newFilter)
    applyFiltersAndSort(searchTerm, sortBy, newFilter)
  }

  // Load initial news on component mount
  useEffect(() => {
    fetchNews({
      topic: "general",
      country: "us",
      startDate: "",
      endDate: "",
    })
  }, [])

  const stats = {
    totalArticles: filteredArticles.length,
    sources: new Set(filteredArticles.map((a) => a.source.name)).size,
    categories: chartData.categoryData.length,
  }

  const handleAdvancedFilter = (filtered: NewsArticle[]) => {
    setFilteredArticles(filtered)
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">News Dashboard</h1>
          <p className="text-gray-600">Stay informed with personalized news insights and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalArticles}</div>
              <CardDescription>Articles found</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News Sources</CardTitle>
              <Globe className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.sources}</div>
              <CardDescription>Unique sources</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.categories}</div>
              <CardDescription>Content categories</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <NewsFilters onFiltersChange={fetchNews} loading={loading} />
        </div>

        <div className="mb-8">
          <AdvancedSearch articles={articles} onFilteredResults={handleAdvancedFilter} />
        </div>

        {/* Sorting and Filtering Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="px-3 py-1 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="date">Date</option>
                <option value="relevance">Relevance</option>
                <option value="source">Source</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="px-3 py-1 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        </div>

        <Tabs defaultValue="analytics" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics & Charts</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            {filteredArticles.length > 0 ? (
              <>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SourcePieChart data={chartData.sourceData} />
                  <SentimentAnalysisChart data={chartData.sentimentData} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CategoryBarChart data={chartData.categoryData} />
                  <KeywordCloud data={chartData.keywordData} />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No data available for charts. Load some articles first.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles">
            {/* Articles Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <NewsArticleCard
                    key={`${article.url}-${index}`}
                    article={article}
                    onSummarize={handleSummarize}
                    summary={summaries[article.url]}
                    summarizing={summarizing[article.url]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found. Try adjusting your filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
