import { MongoClient } from "mongodb"

async function initMongoDB() {
  console.log("Initializing MongoDB collections and indexes...")

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  let client: MongoClient | null = null

  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()

    const db = client.db()

    // Create collections if they don't exist
    await db.createCollection("lists")
    await db.createCollection("list_items")
    await db.createCollection("sources")

    // Create indexes
    await db.collection("lists").createIndex({ sessionId: 1 }, { unique: true, sparse: true })
    await db.collection("lists").createIndex({ userId: 1 }, { sparse: true })
    await db.collection("list_items").createIndex({ listId: 1 })
    await db.collection("sources").createIndex({ listId: 1 })

    console.log("MongoDB initialization completed successfully")
  } catch (error) {
    console.error("MongoDB initialization failed:", error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

initMongoDB().catch(console.error)
