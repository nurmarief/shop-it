import process from 'node:process';
import mongoose from "mongoose";

export const connectDatabase = () => {
  let DB_URI = '';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (process.env.NODE_ENV === 'PRODUCTION') {
    DB_URI = process.env.DB_URI;
  }

  mongoose.connect(DB_URI).then(connection => {
    console.log(`MongoDB connected with HOST: ${connection?.connection?.host}`);
  });
}
