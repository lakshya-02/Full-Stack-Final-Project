import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri("helpdesk"));
    console.log("MongoDB connected using in-memory fallback");
    return;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.warn(`MongoDB connection failed for ${mongoUri}: ${error.message}`);
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri("helpdesk"));
    console.log("MongoDB connected using in-memory fallback");
  }
};
