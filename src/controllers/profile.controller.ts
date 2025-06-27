/**
 * @fileoverview This file contains controller functions for handling profile-related requests.
 * These functions process HTTP requests and responses for profile operations.
 */

import { Response } from 'express';
import * as ProfileService from '../services/profile.service';
import { AuthRequest } from '../utils/authenticate';
import { ERRORS, SUCCESS } from '../utils/error-messages';

/**
 * Handles the creation of a new profile for the authenticated user.
 * @param req - The authenticated request object containing user and profile data.
 * @param res - The response object to send the result of the operation.
 * @returns A JSON response with the created profile or an error message.
 */
export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: ERRORS.USER_NOT_AUTHENTICATED });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ success: false, message: ERRORS.PROFILE_DATA_EMPTY });
      return;
    }

    const profile = await ProfileService.createProfile(userId, req.body);
    res.status(201).json({ success: true, message: SUCCESS.PROFILE_CREATED, profile });
  } catch (err) {
    if ((err as Error).message === ERRORS.PROFILE_ALREADY_EXISTS) {
      res.status(409).json({ success: false, message: ERRORS.PROFILE_ALREADY_EXISTS });
    } else {
      res.status(500).json({ success: false, message: ERRORS.GENERAL_ERROR });
    }
  }
};

/**
 * Retrieves the profile of the authenticated user.
 * @param req - The authenticated request object containing user data.
 * @param res - The response object to send the profile or an error message.
 * @returns A JSON response with the user's profile or an error message.
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: ERRORS.USER_NOT_AUTHENTICATED });
      return;
    }

    const profile = await ProfileService.getProfile(userId);
    if (!profile) {
      res.status(404).json({ success: false, message: ERRORS.PROFILE_NOT_FOUND });
      return;
    }

    res.json({ success: true, message: SUCCESS.PROFILE_FETCHED, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: ERRORS.GENERAL_ERROR });
  }
};

/**
 * Updates the profile of the authenticated user.
 * @param req - The authenticated request object containing user and update data.
 * @param res - The response object to send the updated profile or an error message.
 * @returns A JSON response with the updated profile or an error message.
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: ERRORS.USER_NOT_AUTHENTICATED });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ success: false, message: ERRORS.PROFILE_DATA_EMPTY });
      return;
    }

    const profile = await ProfileService.updateProfile(userId, req.body);
    res.json({ success: true, message: SUCCESS.PROFILE_UPDATED, profile });
  } catch (err) {
    if ((err as any).code === 'P2025') {
      res.status(404).json({ success: false, message: ERRORS.PROFILE_NOT_FOUND });
    } else {
      res.status(500).json({ success: false, message: ERRORS.GENERAL_ERROR });
    }
  }
};