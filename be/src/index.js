// [IMPORT]
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import mongoose from "mongoose";
import exitHandler from './utils/exitHandler.js';
import { setupDotenv } from "./utils/dotenv.js";
import { connectDatabase } from './config/dbConnect.js';
import app from './app.js';

// [SETUP]
// -- Handle events
// ---- Node
process.on("SIGTERM", () => {
  exitHandler({ event: 'SIGTERM' });
});

process.on('uncaughtException', (err) => {
  exitHandler({ event: 'UncaughtException Error', err });
});

process.on('unhandledRejection', (err) => {
  exitHandler({ event: 'UnhandledRejection Error', err })
});

// ---- Mongoose
mongoose.connection.on('error', (err) => {
  exitHandler({ event: 'MongoDB connection error', err });
});

// -- Recreate __dirname
const __filename = fileURLToPath(import.meta.url); // Get the resolved and decode path to the file
const __dirname = dirname(__filename); // Get the name of the directory

// [MAIN LOGIC]
const { PORT: PORT_NUMBER, NODE_ENV } = process.env;

// -- Environment
if (NODE_ENV !== 'PRODUCTION') {
  setupDotenv([__dirname, 'config', 'config.env']);
}

connectDatabase();

app.listen(PORT_NUMBER, () => {
  console.log(`SERVER IS LISTENING TO PORT ${PORT_NUMBER} in ${NODE_ENV} mode`);
});

