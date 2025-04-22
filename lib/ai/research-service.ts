import { OpenAI } from "openai"
import type { ObjectId } from "mongodb"
import {
  createList,
  updateList,
  updateListStatus,
  createListItems,
  createSources,
  getCompleteListBySessionId,
} from "../db/repository"
import type { FieldType, ListItemDocument, SourceDocument } from "../db/models"

// Interface for the research result with dynamic fields
interface ResearchResult {
  title: string
  fields: Array<{
    name: string
    displayName: string
    type: FieldType
    description?: string
    isRequired?: boolean
  }>
  items: Array<{
    position: number
    fields: Record<string, any>
  }>
  sources: Array<{
    url: string
    title?: string
    snippet?: string
    isReliable?: boolean
  }>
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
    fields: [],
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
  "fields": [
    {
      "name": "fieldName", // camelCase, no spaces, used as identifier
      "displayName": "Field Name", // Human-readable name with proper capitalization
      "type": "text", // One of: text, number, boolean, date, url, email, phone, currency, percentage, rating
      "description": "Description of what this field represents", // Optional
      "isRequired": true // Optional, defaults to false
    },
    // Add more fields as needed
  ],
  "items": [
    {
      "position": 1,
      "fields": {
        "fieldName": "Value for this field",
        "anotherField": "Another value",
        // Include values for all defined fields
      }
    },
    // Add more items as needed
  ],
  "sources": [
    {
      "url": "https://example.com",
      "title": "Source title",
      "snippet": "Relevant snippet from the source",
      "isReliable": true
    },
    // Add more sources as needed
  ]
}

IMPORTANT NOTES:
- Always include a "title" field for each item
- Always include a "description" field for each item
- For restaurant or venue lists, include address, rating, and price range if applicable
- For product lists, include price, rating, and key features
- For book or media lists, include author/creator, year, and genre
- For travel destinations, include best time to visit, key attractions, and cost level
- Ensure all field names are valid JavaScript identifiers (camelCase, no spaces or special characters)
- Ensure all field values match their defined type
- Provide at least 5 items in the list, more for complex topics
- Include at least 3 sources with URLs`

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
      fields: result.fields.map((field, index) => ({
        ...field,
        order: index,
      })),
    })

    // Insert the list items with dynamic fields
    if (result.items && Array.isArray(result.items)) {
      const itemsToInsert: Omit<ListItemDocument, "_id">[] = result.items.map((item) => ({
        listId,
        position: item.position,
        fields: item.fields,
        createdAt: new Date(),
      }))

      await createListItems(itemsToInsert)
    }

    // Insert the sources
    if (result.sources && Array.isArray(result.sources)) {
      const sourcesToInsert: Omit<SourceDocument, "_id">[] = result.sources.map((source) => ({
        listId,
        url: source.url,
        title: source.title,
        snippet: source.snippet,
        isReliable: source.isReliable,
        createdAt: new Date(),
      }))

      await createSources(sourcesToInsert)
    }

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
