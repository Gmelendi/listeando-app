import { OpenAI } from "openai"
import type { ObjectId } from "mongodb"
import {
  createList,
  updateList,
  updateListStatus,
  getCompleteListBySessionId,
} from "../db/repository"

// Interface for the research result with dynamic fields
interface ResearchResult {
  title: string
  data: Array<{}>
}

export async function researchAndGenerateList(prompt: string, sessionId?: string, userId?: string): Promise<string> {
  // Create a new list in the database
  const listId = await createList({
    prompt,
    status: "processing",
    sessionId,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: [],
  })

  // Start the research process asynchronously
  performResearch(listId, prompt).catch((error) => {
    console.error("Research failed:", error)
    // Update the list status to failed
    updateListStatus(listId, "failed", error.message)
  })

  // Return the list ID immediately
  return listId.toString()
}

async function performResearch(listId: ObjectId, prompt: string): Promise<void> {
  try {
    // Generate a system prompt that instructs the AI to research and create a list with dynamic fields
    const systemPrompt = `You are an expert researcher tasked with creating a comprehensive, accurate list based on the user's request.

Follow these steps:
1. Analyze the user's request to understand what kind of list they need.
2. Determine the most appropriate fields for this type of list. Each list should have at least 3 fields but no more than 7.
3. Research the topic thoroughly, considering multiple sources.
4. Create a list with items that have values for each of your defined fields.
5. Format your response as a JSON object with the following structure:
{
  "title": "A descriptive title for the list",
  "data": [
    {
      "<field1>": "<value1>",
      "<field2>": "<value2>",
      // add more fields as needed
    }
      // add more items as needed
  ]
}
6. Responde only with the valid JSON object. Do not include any additional text or comments.

IMPORTANT NOTES:
- Always include a "title" field for each item
- Ensure all field names are valid JavaScript identifiers (camelCase, no spaces or special characters)`

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Use OpenAI to generate the list
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Create a well-researched list for: "${prompt}"`,
        },
      ],
      temperature: 0.7,
    })

    // Get the response text
    const text = completion.choices[0].message.content || ""

    // Parse the response
    let result: ResearchResult
    try {
      result = JSON.parse(text)
    } catch (error) {
      console.error("Failed to parse AI response:", text)
      throw new Error("Failed to parse AI response")
    }

    // Update the list with title and fields
    await updateList(listId, {
      title: result.title,
      data: result.data
    })

    // Update the list status to completed
    await updateListStatus(listId, "completed")
  } catch (error) {
    // Update the list status to failed
    await updateListStatus(listId, "failed", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

// Function to get a list by session ID
export async function getListBySessionId(sessionId: string) {
  return getCompleteListBySessionId(sessionId)
}
