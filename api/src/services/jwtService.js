import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);