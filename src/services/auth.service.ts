/**
 * @fileoverview Provides services for user authentication and session management.
 */

import prisma from '../utils/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/hash';
import { ERRORS } from '../utils/error-messages';

/**
 * Registers a new user.
 * @param email - The user's email address.
 * @param username - The user's username.
 * @param password - The user's password.
 * @returns The created user's ID.
 */
export const registerUser = async (email: string, username: string, password: string) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) throw new Error(ERRORS.USER_ALREADY_EXISTS);

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, username, passwordHash },
  });

  return { id: user.id };
};

/**
 * Logs in a user by validating credentials and generating tokens.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns Access and refresh tokens, profile completion status, and user ID.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(ERRORS.INVALID_CREDENTIALS);

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new Error(ERRORS.INVALID_CREDENTIALS);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    isProfileComplete: user.isProfileComplete,
    userId: user.id,
  };
};

/**
 * Refreshes the access token using a valid refresh token.
 * @param refreshToken - The refresh token.
 * @param userId - The user's ID.
 * @returns A new access token.
 */
export const refreshAccessToken = async (refreshToken: string, userId: number) => {
  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  return generateAccessToken(userId);
};

/**
 * Logs out a user by deleting the refresh token.
 * @param refreshToken - The refresh token.
 */
export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

/**
 * Retrieves a user by ID, including profile information.
 * @param userId - The user's ID.
 * @returns The user object, including profile data.
 */
export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Updates the user's profile completion status to complete.
 * @param userId - The user's ID.
 * @returns The updated user object.
 */
export const updateProfileCompletion = async (userId: number) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isProfileComplete: true },
  });

  return updatedUser;
};