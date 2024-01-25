import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import express from 'express';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import handleMongooseError from './middlewares/handleMongooseError.js';
import handleJsonwebtokenError from './middlewares/handleJsonwebtokenError.js';
import catchError from './middlewares/catchError.js';

// // -- Recreate __dirname
const __filename = fileURLToPath(import.meta.url); // Get the resolved and decode path to the file
const __dirname = dirname(__filename); // Get the name of the directory

const app = express();
const { NODE_ENV } = process.env;

app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cookieParser());
app.use('/api/v1', routes);

// Serve FE build files
if (NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, '..', '..', 'fe', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, '..', '..', 'fe', 'build', 'index.html')));
  })
}

app.use(handleJsonwebtokenError);
app.use(handleMongooseError);
app.use(catchError); // must be the last one

export default app;
