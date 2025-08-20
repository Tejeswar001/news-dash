import type { NewsArticle } from "@/types/news"

export interface ChartData {
  sourceData: Array<{ name: string; value: number; fill: string }>
  sentimentData: Array<{ sentiment: string; count: number; fill: string }>
  categoryData: Array<{ category: string; count: number; fill: string }>
  keywordData: Array<{ text: string; value: number }>
}

export function processArticlesForCharts(articles: NewsArticle[]): ChartData {
  // Process source data for pie chart
  const sourceCounts = articles.reduce(
    (acc, article) => {
      const source = article.source.name
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const colors = [
    "hsl(45, 93%, 47%)", // Yellow
    "hsl(35, 91%, 62%)", // Orange
    "hsl(25, 95%, 53%)", // Red-orange
    "hsl(55, 84%, 51%)", // Light yellow
    "hsl(15, 86%, 59%)", // Red
    "hsl(65, 77%, 45%)", // Yellow-green
    "hsl(40, 89%, 43%)", // Dark yellow
    "hsl(30, 87%, 55%)", // Orange-red
  ]

  const sourceData = Object.entries(sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))

  // Process sentiment analysis data
  const sentimentData = analyzeSentiment(articles)

  // Process category data (based on keywords in titles)
  const categoryKeywords = {
    Technology: ["tech", "ai", "artificial intelligence", "software", "digital", "cyber", "innovation"],
    Business: ["business", "economy", "market", "finance", "company", "corporate", "trade"],
    Health: ["health", "medical", "hospital", "doctor", "medicine", "covid", "vaccine"],
    Politics: ["politics", "government", "election", "policy", "congress", "senate", "president"],
    Sports: ["sports", "football", "basketball", "soccer", "olympics", "game", "team"],
    Entertainment: ["entertainment", "movie", "music", "celebrity", "film", "show", "actor"],
    Science: ["science", "research", "study", "discovery", "climate", "space", "environment"],
    Other: [],
  }

  const categoryCounts = Object.keys(categoryKeywords).reduce(
    (acc, category) => {
      acc[category] = 0
      return acc
    },
    {} as Record<string, number>,
  )

  articles.forEach((article) => {
    const title = article.title.toLowerCase()
    const description = (article.description || "").toLowerCase()
    const text = `${title} ${description}`

    let categorized = false
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (category === "Other") continue
      if (keywords.some((keyword) => text.includes(keyword))) {
        categoryCounts[category]++
        categorized = true
        break
      }
    }
    if (!categorized) {
      categoryCounts.Other++
    }
  })

  const categoryData = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([category, count], index) => ({
      category,
      count,
      fill: colors[index % colors.length],
    }))

  // Process keywords for word cloud
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "its",
    "our",
    "their",
    "says",
    "said",
    "after",
    "new",
    "first",
    "last",
    "over",
    "more",
    "also",
    "just",
    "now",
    "than",
    "only",
    "other",
    "some",
    "time",
    "very",
    "when",
    "come",
    "during",
    "back",
    "general",
    "however",
    "out",
    "many",
    "from",
    "up",
    "about",
    "into",
    "through",
    "before",
    "under",
    "around",
    "among",
    "between",
    "while",
    "where",
    "why",
    "how",
    "what",
    "who",
    "which",
    "whose",
    "whom",
    "get",
    "got",
    "make",
    "made",
    "take",
    "took",
    "give",
    "gave",
    "go",
    "went",
    "see",
    "saw",
    "know",
    "knew",
    "think",
    "thought",
    "look",
    "looked",
    "use",
    "used",
    "find",
    "found",
    "work",
    "worked",
    "call",
    "called",
    "try",
    "tried",
    "ask",
    "asked",
    "need",
    "needed",
    "feel",
    "felt",
    "become",
    "became",
    "leave",
    "left",
    "put",
    "keep",
    "kept",
    "let",
    "begin",
    "began",
    "seem",
    "seemed",
    "help",
    "helped",
    "talk",
    "talked",
    "turn",
    "turned",
    "start",
    "started",
    "show",
    "showed",
    "hear",
    "heard",
    "play",
    "played",
    "run",
    "ran",
    "move",
    "moved",
    "live",
    "lived",
    "believe",
    "believed",
    "bring",
    "brought",
    "happen",
    "happened",
    "write",
    "wrote",
    "provide",
    "provided",
    "sit",
    "sat",
    "stand",
    "stood",
    "lose",
    "lost",
    "pay",
    "paid",
    "meet",
    "met",
    "include",
    "included",
    "continue",
    "continued",
    "set",
    "tell",
    "told",
  ])

  const wordCounts = articles
    .flatMap((article) => [article.title, article.description || ""])
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word))
    .reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const keywordData = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([text, value]) => ({ text, value }))

  return { sourceData, sentimentData, categoryData, keywordData }
}

function analyzeSentiment(articles: NewsArticle[]): Array<{ sentiment: string; count: number; fill: string }> {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "success",
    "win",
    "victory",
    "achievement",
    "breakthrough",
    "progress",
    "improve",
    "better",
    "best",
    "positive",
    "optimistic",
    "hope",
    "celebrate",
    "joy",
    "happy",
    "pleased",
    "excited",
    "thrilled",
    "proud",
    "love",
    "like",
    "enjoy",
    "benefit",
    "gain",
    "profit",
    "growth",
    "increase",
    "rise",
    "boost",
    "advance",
    "forward",
  ]

  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "disaster",
    "crisis",
    "problem",
    "issue",
    "concern",
    "worry",
    "fear",
    "danger",
    "risk",
    "threat",
    "attack",
    "violence",
    "war",
    "conflict",
    "fight",
    "death",
    "kill",
    "murder",
    "crime",
    "steal",
    "fraud",
    "corruption",
    "scandal",
    "controversy",
    "decline",
    "fall",
    "drop",
    "decrease",
    "loss",
    "fail",
    "failure",
    "reject",
    "deny",
    "oppose",
    "against",
    "protest",
    "angry",
    "mad",
    "upset",
    "sad",
    "disappointed",
    "frustrated",
    "hate",
  ]

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 }

  articles.forEach((article) => {
    const text = `${article.title} ${article.description || ""}`.toLowerCase()
    const words = text.split(/\s+/)

    let positiveScore = 0
    let negativeScore = 0

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveScore++
      if (negativeWords.includes(word)) negativeScore++
    })

    if (positiveScore > negativeScore) {
      sentimentCounts.positive++
    } else if (negativeScore > positiveScore) {
      sentimentCounts.negative++
    } else {
      sentimentCounts.neutral++
    }
  })

  return [
    { sentiment: "Positive", count: sentimentCounts.positive, fill: "hsl(120, 70%, 50%)" },
    { sentiment: "Neutral", count: sentimentCounts.neutral, fill: "hsl(45, 93%, 47%)" },
    { sentiment: "Negative", count: sentimentCounts.negative, fill: "hsl(0, 70%, 50%)" },
  ].filter((item) => item.count > 0)
}
