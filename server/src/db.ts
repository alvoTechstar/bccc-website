import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables if not already loaded by index.ts
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable is not set.");
  process.exit(1);
}

// Returns native Db (typed as any to avoid version mismatch between
// `mongodb` and mongoose's bundled `mongodb` types).
export async function connectToDb(): Promise<any> {
  try {
    await mongoose.connect(MONGO_URI as string);
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("mongoose.connection.db is undefined after connect");
    }
    console.log("Connected to MongoDB successfully using Mongoose.");
    return db; // Return the Db object
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw error;
  }
}

// Optional: Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});