interface SummarizationResponse {
  summary_text: string
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 50,
          do_sample: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats
    if (Array.isArray(data) && data.length > 0) {
      return data[0].summary_text || "Unable to generate summary."
    }

    if (data.summary_text) {
      return data.summary_text
    }

    throw new Error("Invalid response format from Hugging Face API")
  } catch (error) {
    console.error("Error summarizing text:", error)
    throw new Error("Failed to generate summary. Please try again.")
  }
}

export function prepareTextForSummarization(article: {
  title: string
  description?: string
  content?: string
}): string {
  // Combine title, description, and content for better summarization
  const parts = [article.title, article.description, article.content].filter(Boolean)

  let text = parts.join(". ")

  // Limit text length to avoid API limits (typically 1024 tokens)
  if (text.length > 3000) {
    text = text.substring(0, 3000) + "..."
  }

  return text
}
