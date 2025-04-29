"use server"

import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

export async function enhancePrompt(prompt: string): Promise<string> {
	try {
		const chat = new ChatOpenAI({temperature: 0.7, model: "gpt-4.1-2025-04-14"})

		const response = await chat.invoke([
			new SystemMessage(
			"You are an expert at improving list descriptions to be more precise and detailed. Enhance the given prompt while maintaining its core intent and adding specific, relevant details that will help generate a better list."
			),
			new HumanMessage(`Please enhance this list description while maintaining its core purpose: "${prompt}"`)
		])

		return response.content.toString()
	} catch (error) {
		console.error("Prompt enhancement failed:", error)
		throw new Error("Failed to enhance prompt")
	}
}