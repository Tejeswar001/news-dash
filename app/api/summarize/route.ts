import { type NextRequest, NextResponse } from "next/server"
import { summarizeText, prepareTextForSummarization } from "@/lib/huggingface-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content } = body

    if (!title) {
      return NextResponse.json({ error: "Article title is required" }, { status: 400 })
    }

    const textToSummarize = prepareTextForSummarization({ title, description, content })

    if (textToSummarize.length < 50) {
      return NextResponse.json({ error: "Article content too short to summarize" }, { status: 400 })
    }

    const summary = await summarizeText(textToSummarize)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summarization API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      { status: 500 },
    )
  }
}
