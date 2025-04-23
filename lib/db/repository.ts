import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { ListDocument, ListStatus } from "./models"

// Lists collection
export async function createList(list: Omit<ListDocument, "_id">): Promise<ObjectId> {
  const collection = await getCollection<ListDocument>("lists")
  const result = await collection.insertOne(list)
  return result.insertedId
}

export async function updateList(id: ObjectId, update: Partial<ListDocument>): Promise<void> {
  const collection = await getCollection<ListDocument>("lists")
  await collection.updateOne({ _id: id }, { $set: { ...update, updatedAt: new Date() } })
}

export async function updateListStatus(id: ObjectId, status: ListStatus, error?: string): Promise<void> {
  const collection = await getCollection<ListDocument>("lists")
  const update: any = { status, updatedAt: new Date() }
  if (error) update.error = error
  await collection.updateOne({ _id: id }, { $set: update })
}

export async function getListById(id: ObjectId | string): Promise<ListDocument | null> {
  const objectId = typeof id === "string" ? new ObjectId(id) : id
  const collection = await getCollection<ListDocument>("lists")
  return collection.findOne({ _id: objectId })
}

export async function getListBySessionId(sessionId: string): Promise<ListDocument | null> {
  const collection = await getCollection<ListDocument>("lists")
  return collection.findOne({ sessionId })
}

// Get complete list with items and sources
export async function getCompleteList(listId: ObjectId | string): Promise<ListDocument | null> {
  const objectId = typeof listId === "string" ? new ObjectId(listId) : listId

  const list = await getListById(objectId)
  if (!list) return null

  return list
}

export async function getCompleteListBySessionId(sessionId: string): Promise<ListDocument | null> {
  const list = await getListBySessionId(sessionId)
  if (!list) return null

  return getCompleteList(list._id!)
}
