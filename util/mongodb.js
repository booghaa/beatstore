import { MongoClient } from 'mongodb'
const user = process.env.NEXT_PUBLIC_MONGO_USERNAME;
const password = process.env.NEXT_PUBLIC_MONGO_PASSWORD;
const dbName = process.env.NEXT_PUBLIC_MONGO_DB;
const uri = `mongodb+srv://${user}:${password}@cluster0.ekj5n0d.mongodb.net/?retryWrites=true&w=majority`;


let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}