import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  console.debug("MongoDB: connecting", { dbName, hasUri: Boolean(uri) });

  if (uri === "") {
    throw new Error("MongoDB URI is empty, possibly non-existent");
  }

  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  console.debug("MongoDB: connection established", { dbName });
  return db;
}

export async function closeDb() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
