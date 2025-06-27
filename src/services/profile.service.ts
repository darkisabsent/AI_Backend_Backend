/**
 * This file contains service functions for managing user profiles.
 * These functions interact with the database and handle business logic.
 */

import { PrismaClient } from '@prisma/client';
import { buildAIContext } from '../utils/aiContextBuilder';
import { ERRORS } from '../utils/error-messages';

const prisma = new PrismaClient();

/**
 * Creates a new profile for a user.
 * @param userId - The ID of the user.
 * @param data - The profile data to be created.
 * @returns The created profile.
 * @throws Error if the profile already exists.
 */
export const createProfile = async (userId: number, data: any) => {
  // TODO: Validate `data` to ensure it contains required fields.
  const existing = await prisma.userProfile.findUnique({ where: { userId } });
  if (existing) throw new Error(ERRORS.PROFILE_ALREADY_EXISTS);

  const profile = await prisma.userProfile.create({
    data: { ...data, userId },
  });

  const aiContext = buildAIContext(profile);

  await prisma.user.update({
    where: { id: userId },
    data: {
      isProfileComplete: true,
      aiProfileContext: aiContext,
    },
  });

  return profile;
};

/**
 * Retrieves the profile of a user.
 * @param userId - The ID of the user.
 * @returns The user's profile or null if not found.
 */
export const getProfile = async (userId: number) => {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
};

/**
 * Updates the profile of a user.
 * @param userId - The ID of the user.
 * @param data - The profile data to be updated.
 * @returns The updated profile.
 * @throws Error if the profile does not exist.
 */
export const updateProfile = async (userId: number, data: any) => {
  // TODO: Validate `data` to ensure it contains valid fields for update.
  const profile = await prisma.userProfile.update({
    where: { userId },
    data,
  });

  const aiContext = buildAIContext(profile);

  await prisma.user.update({
    where: { id: userId },
    data: { aiProfileContext: aiContext },
  });

  return profile;
};
