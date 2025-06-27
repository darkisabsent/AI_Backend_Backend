import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
