"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash } from "lucide-react"

interface KeywordCloudProps {
  data: Array<{ text: string; value: number }>
}

export function KeywordCloud({ data }: KeywordCloudProps) {
  const maxValue = Math.max(...data.map((item) => item.value))
  const minValue = Math.min(...data.map((item) => item.value))

  const getFontSize = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue)
    return Math.max(12, Math.min(32, 12 + normalized * 20))
  }

  const getOpacity = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue)
    return Math.max(0.5, 0.5 + normalized * 0.5)
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-yellow-600" />
          Trending Keywords
        </CardTitle>
        <CardDescription>Most frequently mentioned words in articles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-wrap items-center justify-center gap-2 p-4 overflow-hidden">
          {data.map((keyword, index) => (
            <span
              key={keyword.text}
              className="inline-block px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 font-medium transition-all hover:bg-yellow-200 cursor-default"
              style={{
                fontSize: `${getFontSize(keyword.value)}px`,
                opacity: getOpacity(keyword.value),
              }}
              title={`${keyword.text}: ${keyword.value} mentions`}
            >
              {keyword.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
