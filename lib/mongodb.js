import { MongoClient } from 'mongodb';

let client;
let clientPromise;

const uri = process.env.MONGO_URI;
const options = {};

if (!process.env.MONGO_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getMongoCollection() {
  const client = await clientPromise;
 const db = client.db('blog_summarizer');
  return db.collection('blogs');
}
