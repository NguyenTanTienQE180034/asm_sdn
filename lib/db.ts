import mongoose, { Mongoose } from "mongoose";
declare global {
    var mongoose:
        | {
              conn: Mongoose | null;
              promise: Promise<Mongoose> | null;
          }
        | undefined;
}
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached!.conn) {
        console.log("Using cached MongoDB connection");
        return cached!.conn;
    }

    try {
        console.log(
            "Connecting to MongoDB with URI:",
            MONGODB_URI!.replace(/:([^@]+)@/, ":****@")
        );
        if (!cached!.promise) {
            const opts = {
                bufferCommands: false,
            };
            cached!.promise = mongoose
                .connect(MONGODB_URI!, opts)
                .then((mongoose) => {
                    console.log("MongoDB connected successfully");
                    return mongoose;
                });
        }
        cached!.conn = await cached!.promise;
        return cached!.conn;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("MongoDB connection error:", {
                message: error.message,
                stack: error.stack,
            });
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

export { connectDB };
