import process from 'node:process';
import { Error as MongooseError, mongo } from "mongoose";
import ErrorData from "../utils/ErrorData.js";

const handleMongooseError = (err, req, res, next) => {
  const { NODE_ENV } = process.env;
  const isMongooseError = err instanceof MongooseError || err instanceof mongo.MongoError;

  if (isMongooseError) {
    if (err instanceof MongooseError.CastError) {
      const errorData = new ErrorData('Request value was not in correct format', 400);
      return next(errorData);
    }

    if (err instanceof MongooseError.ValidationError) {
      const message = Object.values(err.errors).map(value => value.message);
      const errorData = new ErrorData(message, 404);
      return next(errorData);
    }

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      const errorData = new ErrorData(message, 404);
      return next(errorData);
    }

    if (NODE_ENV === 'PRODUCTION') {
      const errorData = new ErrorData('Input error', 400);
      return next(errorData);
    }
  }

  return next(err);
}

export default handleMongooseError;
