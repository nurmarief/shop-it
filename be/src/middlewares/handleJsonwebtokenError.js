import process from 'node:process';
import jsonwebtoken from "jsonwebtoken";
import ErrorData from "../utils/ErrorData.js";

const handleJsonwebtokenError = (err, req, res, next) => {
  const { NODE_ENV } = process.env;
  const isJsonWebTokenError = err instanceof jsonwebtoken.JsonWebTokenError;

  if (isJsonWebTokenError) {
    if (err.name === 'JsonWebTokenError') {
      const errorData = new ErrorData('Json web token is invalid', 400);
      return next(errorData);
    }

    if (err.name === 'tokenExpiredError') {
      const errorData = new ErrorData('Json web token is expired', 400);
      return next(errorData);
    }

    if (NODE_ENV === 'PRODUCTION') {
      const errorData = new ErrorData('Json web token error', 400);
      return next(errorData);
    }
  }

  return next(err);
};

export default handleJsonwebtokenError;
