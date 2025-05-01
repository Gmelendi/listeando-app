import type { ObjectId } from "mongodb"
import {
  createList,
  updateList,
  updateListStatus,
  getCompleteListBySessionId,
} from "../db/repository"
import { agent } from "./agent"

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
  await performResearch(listId, prompt).catch((error) => {
    console.error("Research failed:", error)
    // Update the list status to failed
    updateListStatus(listId, "failed", error.message)
  })

  // Return the list ID immediately
  return listId.toString()
}

async function performResearch(listId: ObjectId, prompt: string): Promise<void> {
	try {
    	console.log("Performing research with prompt:", prompt)
		const outputState = await agent.invoke({user_prompt: prompt, id: listId.toString()})
    	console.log("Research completed")
		// Get the response text
		const result = {
			title: outputState.title,
			data: outputState.extracted_results
		} as ResearchResult;

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
