import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const databaseUri = process.env.DATABASE_URI;

  if (!databaseUri) {
    console.error("DATABASE_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(databaseUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
};

export default connectDB;
