import process from 'node:process';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, hashToken } from '../utils/token.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [50, 'Your name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Your password must be longer than 6 characters'],
    select: false,
  },
  avatar: {
    public_id: String, // will come from cloudinary
    url: String, // will come from cloudinary
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  const { JWT_SECRET, JWT_EXPIRES_TIME } = process.env;
  const payload = { id: this._id };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_TIME,
  });
}

userSchema.methods.comparePassword = async function ({ enteredPassword }) {
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = async function () {
  const { RESET_PASSWORD_RANDOM_STRING_LENGTH, RESET_PASSWORD_HASH_ALGORITHM, RESET_PASSWORD_ENCODING } = process.env;
  const resetToken = generateToken({ length: Number(RESET_PASSWORD_RANDOM_STRING_LENGTH), encoding: RESET_PASSWORD_ENCODING });
  const hashedResetToken = hashToken({ algorithm: RESET_PASSWORD_HASH_ALGORITHM, token: resetToken, encoding: RESET_PASSWORD_ENCODING });

  const expireInThirtyMinutes = Date.now() + (30 * 60 * 100);

  await this.setPasswordChangerProperty({ resetPasswordToken: hashedResetToken, resetPasswordExpire: expireInThirtyMinutes });

  return resetToken;
}

userSchema.methods.setPasswordChangerProperty = async function ({ resetPasswordToken, resetPasswordExpire }) {
  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = resetPasswordExpire;
  await this.save();
}

userSchema.methods.setPassword = async function ({ password }) {
  this.password = password;
  await this.save();
  await this.setPasswordChangerProperty({ resetPasswordToken: undefined, resetPasswordExpire: undefined });
}

export default mongoose.model('User', userSchema);
