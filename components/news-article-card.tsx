"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User, Sparkles } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsArticleCardProps {
  article: NewsArticle
  onSummarize: (article: NewsArticle) => void
  summary?: string
  summarizing?: boolean
}

export function NewsArticleCard({ article, onSummarize, summary, summarizing }: NewsArticleCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-yellow-200 hover:shadow-lg transition-shadow h-full flex flex-col">
      {article.urlToImage && !imageError && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={article.urlToImage || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
            {article.source.name}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <CardTitle className="text-lg leading-tight line-clamp-2">{article.title}</CardTitle>

        {article.author && (
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            {article.author}
          </div>
        )}

        <CardDescription className="line-clamp-3">{article.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {summary && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Summary
            </h4>
            <p className="text-sm text-yellow-700">{summary}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => onSummarize(article)}
            disabled={summarizing}
            variant="outline"
            size="sm"
            className="border-yellow-200 hover:bg-yellow-50"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {summarizing ? "Summarizing..." : "Summarize"}
          </Button>

          <Button asChild size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Read Full
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
