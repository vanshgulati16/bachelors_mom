import { clsx } from "clsx"
import mongoose from "mongoose"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function connectToDatabase() {
  try {
    if (mongoose.connections[0].readyState) return;
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "nextAuth"
    });

    console.log(`Connected to DB: ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    throw new Error("Failed to connect to the database");
  }
}