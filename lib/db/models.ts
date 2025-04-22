import type { ObjectId } from "mongodb"

// List status enum
export type ListStatus = "pending" | "processing" | "completed" | "failed"

// Field type enum
export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "url"
  | "email"
  | "phone"
  | "currency"
  | "percentage"
  | "rating"

// Field definition interface
export interface FieldDefinition {
  name: string
  displayName: string
  type: FieldType
  description?: string
  isRequired?: boolean
  order: number
}

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
  fields: FieldDefinition[]
}

// List item document interface
export interface ListItemDocument {
  _id?: ObjectId
  listId: ObjectId
  position: number
  fields: Record<string, any>
  createdAt: Date
}

// Source document interface
export interface SourceDocument {
  _id?: ObjectId
  listId: ObjectId
  url: string
  title?: string
  snippet?: string
  isReliable?: boolean
  createdAt: Date
}

// Complete list with items and sources
export interface CompleteList extends ListDocument {
  items: ListItemDocument[]
  sources: SourceDocument[]
}
