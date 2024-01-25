import process from 'node:process';

class ErrorData extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    if (process.env.NODE_ENV === 'DEVELOPMENT') Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorData;
