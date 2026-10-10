import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solvigil";
  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.error(`[Database Error] Could not connect to MongoDB at ${uri}: ${err.message}`);
    console.error(`[Database Note] Ensure MongoDB service is running (e.g., mongod or Windows Service 'MongoDB').`);
    throw err;
  }
}

export function getDBStatus() {
  return isConnected && mongoose.connection.readyState === 1;
}
