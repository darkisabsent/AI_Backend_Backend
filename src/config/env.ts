import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  ACCESS_TOKEN_EXPIRES_IN: '1h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
};