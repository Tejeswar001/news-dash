"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePreferences } from "@/contexts/preferences-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { NewsFilters } from "@/types/news"

interface NewsFiltersProps {
  onFiltersChange: (filters: NewsFilters) => void
  loading: boolean
}

const topics = [
  { value: "general", label: "General" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
  { value: "artificial intelligence", label: "AI" },
  { value: "environment", label: "Environment" },
  { value: "politics", label: "Politics" },
]

const countries = [
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "all", label: "All Countries" },
]

export function NewsFiltersComponent({ onFiltersChange, loading }: NewsFiltersProps) {
  const { preferences } = usePreferences()
  const [filters, setFilters] = useState<NewsFilters>({
    topic: "general",
    country: "us",
    startDate: "",
    endDate: "",
    searchQuery: "",
  })

  useEffect(() => {
    if (preferences) {
      setFilters((prev) => ({
        ...prev,
        topic: preferences.defaultTopics[0] || "general",
        country: preferences.defaultCountry,
      }))
    }
  }, [preferences])

  const handleFilterChange = (key: keyof NewsFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange(filters)
  }

  const handleQuickSearch = (query: string) => {
    const newFilters = { ...filters, searchQuery: query, topic: "general" }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleQuickTopic = (topic: string) => {
    const newFilters = { ...filters, topic, searchQuery: "" }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-yellow-600" />
          News Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Interest</Label>
              <Select value={filters.topic} onValueChange={(value) => handleFilterChange("topic", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Region</Label>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="border-yellow-200 focus:border-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="border-yellow-200 focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search Keywords</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                type="text"
                placeholder="Enter keywords to search..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="border-yellow-200 focus:border-yellow-400"
              />
              <Button type="submit" disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>

          {preferences && preferences.defaultTopics.length > 0 && (
            <div className="space-y-2">
              <Label>Your Preferred Topics</Label>
              <div className="flex flex-wrap gap-2">
                {preferences.defaultTopics.map((topic) => (
                  <Button
                    key={topic}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTopic(topic)}
                    className="border-yellow-200 hover:bg-yellow-50 text-xs"
                  >
                    {topics.find((t) => t.value === topic)?.label || topic}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Quick searches:</span>
            {["AI", "Climate Change", "Cryptocurrency", "Space", "Health"].map((query) => (
              <Button
                key={query}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(query)}
                className="border-yellow-200 hover:bg-yellow-50 text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { NewsFiltersComponent as NewsFilters }
export default NewsFiltersComponent
