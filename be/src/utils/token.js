import process from 'node:process';
import crypto from 'node:crypto';

export const generateToken = ({ length, encoding }) => {
  return crypto.randomBytes(length).toString(encoding);
};

export const hashToken = ({ algorithm, token, encoding }) => {
  return crypto
    .createHash(algorithm)
    .update(token)
    .digest(encoding);
};

export const sendToken = ({ user, statusCode, res }) => {
  const token = user.getJwtToken();
  const { COOKIE_EXPIRES_TIME } = process.env;
  const oneDay = 24 * 60 * 60 * 1000;
  const expireTime = new Date(Date.now() + (COOKIE_EXPIRES_TIME * oneDay));
  const cookieOptions = {
    expires: expireTime,
    httpOnly: true,
  };

  res.
    status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      token,
    });
};
