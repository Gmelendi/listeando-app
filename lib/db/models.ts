import type { ObjectId } from "mongodb"

// List status enum
export type ListStatus = "pending" | "processing" | "completed" | "failed"


// List document interface
export interface ListDocument {
  _id?: ObjectId
  prompt: string
  title?: string
  createdAt: Date
  updatedAt: Date
  status: ListStatus
  sessionId?: string
  userId?: string
  error?: string
  data: Record<string, any>[]
}

