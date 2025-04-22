import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { ListDocument, ListItemDocument, SourceDocument, CompleteList, ListStatus } from "./models"

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

// List items collection
export async function createListItems(items: Omit<ListItemDocument, "_id">[]): Promise<void> {
  if (items.length === 0) return
  const collection = await getCollection<ListItemDocument>("list_items")
  await collection.insertMany(items)
}

export async function getListItems(listId: ObjectId): Promise<ListItemDocument[]> {
  const collection = await getCollection<ListItemDocument>("list_items")
  return collection.find({ listId }).sort({ position: 1 }).toArray()
}

// Sources collection
export async function createSources(sources: Omit<SourceDocument, "_id">[]): Promise<void> {
  if (sources.length === 0) return
  const collection = await getCollection<SourceDocument>("sources")
  await collection.insertMany(sources)
}

export async function getListSources(listId: ObjectId): Promise<SourceDocument[]> {
  const collection = await getCollection<SourceDocument>("sources")
  return collection.find({ listId }).toArray()
}

// Get complete list with items and sources
export async function getCompleteList(listId: ObjectId | string): Promise<CompleteList | null> {
  const objectId = typeof listId === "string" ? new ObjectId(listId) : listId

  const list = await getListById(objectId)
  if (!list) return null

  const items = await getListItems(objectId)
  const sources = await getListSources(objectId)

  return {
    ...list,
    items,
    sources,
  }
}

export async function getCompleteListBySessionId(sessionId: string): Promise<CompleteList | null> {
  const list = await getListBySessionId(sessionId)
  if (!list) return null

  return getCompleteList(list._id!)
}
