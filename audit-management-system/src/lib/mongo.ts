import { MongoClient, Db } from "mongodb";
import { Company } from "./schemas";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "cleanaudits";

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const getClient = async () => {
  if (client) return client;
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri).then((c) => {
      client = c;
      return c;
    });
  }
  return clientPromise;
};

export const getDb = async (): Promise<Db> => {
  const c = await getClient();
  return c.db(dbName);
};

export const getCollection = async <T = unknown>(name: string) => {
  const db = await getDb();
  return db.collection<Company>(name);
};
