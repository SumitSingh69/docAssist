import mongoose from "mongoose";
import env from "./env.config.js";

const DatabaseConnect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default DatabaseConnect;
