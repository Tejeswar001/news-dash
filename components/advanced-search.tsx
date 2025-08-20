"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface AdvancedSearchProps {
  articles: NewsArticle[]
  onFilteredResults: (filtered: NewsArticle[]) => void
}

interface SearchFilters {
  keywords: string
  author: string
  source: string
  dateRange: "all" | "today" | "week" | "month"
  sortBy: "relevance" | "date" | "source"
  sortOrder: "asc" | "desc"
  hasImage: boolean
  minWordCount: number
}

export function AdvancedSearch({ articles, onFilteredResults }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: "",
    author: "",
    source: "",
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
    hasImage: false,
    minWordCount: 0,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const sources = Array.from(new Set(articles.map((a) => a.source.name))).sort()
  const authors = Array.from(new Set(articles.map((a) => a.author).filter(Boolean))).sort()

  const applyFilters = () => {
    let filtered = [...articles]

    // Keyword search
    if (filters.keywords.trim()) {
      const keywords = filters.keywords
        .toLowerCase()
        .split(" ")
        .filter((k) => k.length > 0)
      filtered = filtered.filter((article) => {
        const searchText = `${article.title} ${article.description || ""} ${article.content || ""}`.toLowerCase()
        return keywords.every((keyword) => searchText.includes(keyword))
      })
    }

    // Author filter
    if (filters.author) {
      filtered = filtered.filter((article) => article.author === filters.author)
    }

    // Source filter
    if (filters.source) {
      filtered = filtered.filter((article) => article.source.name === filters.source)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (filters.dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((article) => new Date(article.publishedAt) >= cutoffDate)
    }

    // Image filter
    if (filters.hasImage) {
      filtered = filtered.filter((article) => article.urlToImage)
    }

    // Word count filter
    if (filters.minWordCount > 0) {
      filtered = filtered.filter((article) => {
        const wordCount = (article.description || "").split(" ").length + (article.content || "").split(" ").length
        return wordCount >= filters.minWordCount
      })
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          break
        case "source":
          comparison = a.source.name.localeCompare(b.source.name)
          break
        case "relevance":
          // Simple relevance based on keyword matches in title
          if (filters.keywords.trim()) {
            const aMatches = (a.title.toLowerCase().match(new RegExp(filters.keywords.toLowerCase(), "g")) || []).length
            const bMatches = (b.title.toLowerCase().match(new RegExp(filters.keywords.toLowerCase(), "g")) || []).length
            comparison = aMatches - bMatches
          }
          break
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    // Update active filters for display
    const active: string[] = []
    if (filters.keywords.trim()) active.push(`Keywords: ${filters.keywords}`)
    if (filters.author) active.push(`Author: ${filters.author}`)
    if (filters.source) active.push(`Source: ${filters.source}`)
    if (filters.dateRange !== "all") active.push(`Date: ${filters.dateRange}`)
    if (filters.hasImage) active.push("Has Image")
    if (filters.minWordCount > 0) active.push(`Min ${filters.minWordCount} words`)

    setActiveFilters(active)
    onFilteredResults(filtered)
  }

  const clearFilters = () => {
    setFilters({
      keywords: "",
      author: "",
      source: "",
      dateRange: "all",
      sortBy: "date",
      sortOrder: "desc",
      hasImage: false,
      minWordCount: 0,
    })
    setActiveFilters([])
    onFilteredResults(articles)
  }

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith("Keywords:")) {
      setFilters((prev) => ({ ...prev, keywords: "" }))
    } else if (filterText.startsWith("Author:")) {
      setFilters((prev) => ({ ...prev, author: "" }))
    } else if (filterText.startsWith("Source:")) {
      setFilters((prev) => ({ ...prev, source: "" }))
    } else if (filterText.startsWith("Date:")) {
      setFilters((prev) => ({ ...prev, dateRange: "all" }))
    } else if (filterText === "Has Image") {
      setFilters((prev) => ({ ...prev, hasImage: false }))
    } else if (filterText.startsWith("Min")) {
      setFilters((prev) => ({ ...prev, minWordCount: 0 }))
    }

    setTimeout(applyFilters, 0)
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-yellow-600" />
              Advanced Search & Filter
            </CardTitle>
            <CardDescription>Powerful search and filtering options for precise article discovery</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-yellow-200 hover:bg-yellow-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            {isExpanded ? "Simple" : "Advanced"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search articles by keywords..."
            value={filters.keywords}
            onChange={(e) => setFilters((prev) => ({ ...prev, keywords: e.target.value }))}
            className="border-yellow-200 focus:border-yellow-400"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <Button onClick={applyFilters} className="bg-yellow-600 hover:bg-yellow-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-yellow-200">
            <div className="space-y-2">
              <Label>Author</Label>
              <Select
                value={filters.author}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, author: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any author</SelectItem>
                  {authors.slice(0, 20).map((author) => (
                    <SelectItem key={author} value={author!}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={filters.source}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any source</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value: any) => setFilters((prev) => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past week</SelectItem>
                  <SelectItem value="month">Past month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: any) => setFilters((prev) => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: any) => setFilters((prev) => ({ ...prev, sortOrder: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Minimum Words</Label>
              <Input
                type="number"
                min="0"
                value={filters.minWordCount}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minWordCount: Number.parseInt(e.target.value) || 0 }))
                }
                className="border-yellow-200 focus:border-yellow-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasImage"
                checked={filters.hasImage}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, hasImage: checked as boolean }))}
                className="border-yellow-300 data-[state=checked]:bg-yellow-600"
              />
              <Label htmlFor="hasImage">Has image</Label>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-yellow-200">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                onClick={() => removeFilter(filter)}
              >
                {filter}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-yellow-200 hover:bg-yellow-50 text-xs bg-transparent"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
