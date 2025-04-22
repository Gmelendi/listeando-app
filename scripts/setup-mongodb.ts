import { MongoClient } from "mongodb"
import { getDatabase } from "../lib/db/mongodb"

async function setupMongoDB() {
  console.log("Setting up MongoDB collections and indexes...")

  try {
    const db = await getDatabase()

    // Create collections if they don't exist
    await db.createCollection("lists")
    await db.createCollection("list_items")
    await db.createCollection("sources")

    // Create indexes
    await db.collection("lists").createIndex({ sessionId: 1 }, { unique: true, sparse: true })
    await db.collection("lists").createIndex({ userId: 1 }, { sparse: true })
    await db.collection("list_items").createIndex({ listId: 1, position: 1 })
    await db.collection("sources").createIndex({ listId: 1 })

    console.log("MongoDB setup completed successfully")
  } catch (error) {
    console.error("MongoDB setup failed:", error)
    process.exit(1)
  } finally {
    // Close the MongoDB connection
    const client = await MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/listeando")
    await client.close()
  }
}

setupMongoDB()
