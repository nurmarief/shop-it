import process from 'node:process';
import ErrorData from '../utils/ErrorData.js';

const catchError = (err, req, res, next) => {
  const { NODE_ENV } = process.env;
  const newErrorData = new ErrorData(err.message || 'Internal server error', err.statusCode || 500);

  if (NODE_ENV === 'DEVELOPMENT') {
    return res
      .status(newErrorData.statusCode)
      .json({
        message: newErrorData.message,
        error: err,
        stack: err.stack,
      });
  }

  res
    .status(newErrorData.statusCode)
    .json({
      message: newErrorData.message,
    });
};

export default catchError;
