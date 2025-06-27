/**
 * @fileoverview Contains controller functions for handling authentication-related requests.
 * These functions process HTTP requests and responses for user authentication and session management.
 */

import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import * as ProfileService from '../services/profile.service';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthRequest } from '../utils/authenticate';
import { ERRORS, SUCCESS } from '../utils/error-messages';

/**
 * Handles user registration.
 * @param req - The request object containing user registration data.
 * @param res - The response object to send the result of the operation.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    // TODO: Validate `email`, `username`, and `password` for proper format and constraints.
    const user = await AuthService.registerUser(email, username, password);
    res.status(201).json({ success: true, message: SUCCESS.USER_REGISTERED, user, redirectToLogin: true });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
};

/**
 * Handles user login.
 * @param req - The request object containing user login credentials.
 * @param res - The response object to send the result of the operation.
 * @returns A JSON response with access and refresh tokens or an error message.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // TODO: Validate `email` and `password` for proper format.
    const data = await AuthService.loginUser(email, password);
    res.status(200).json({ success: true, message: SUCCESS.USER_LOGGED_IN, ...data });
  } catch (err) {
    res.status(401).json({ success: false, message: (err as Error).message });
  }
};

/**
 * Handles refreshing the access token using a refresh token.
 * @param req - The request object containing the refresh token.
 * @param res - The response object to send the new access token or an error message.
 * @returns A JSON response with the new access token or an error message.
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: ERRORS.REFRESH_TOKEN_MISSING });
      return;
    }

    const data = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as { userId: number };
    const accessToken = await AuthService.refreshAccessToken(refreshToken, data.userId);

    res.json({ success: true, message: SUCCESS.ACCESS_TOKEN_REFRESHED, accessToken });
  } catch (err) {
    res.status(403).json({ success: false, message: ERRORS.REFRESH_TOKEN_INVALID });
  }
};

/**
 * Handles user logout by invalidating the refresh token.
 * @param req - The request object containing the refresh token.
 * @param res - The response object to confirm logout or send an error message.
 * @returns A JSON response confirming logout or an error message.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: ERRORS.REFRESH_TOKEN_MISSING });
      return;
    }

    await AuthService.logoutUser(refreshToken);
    res.status(200).json({ success: true, message: SUCCESS.USER_LOGGED_OUT });
  } catch (err) {
    res.status(500).json({ success: false, message: ERRORS.LOGOUT_ERROR });
  }
};

/**
 * Retrieves the authenticated user's data along with their profile.
 * @param req - The authenticated request object containing user data.
 * @param res - The response object to send the user and profile data or an error message.
 * @returns A JSON response with the user's data and profile or an error message.
 */
export const getUserWithProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: ERRORS.USER_NOT_AUTHENTICATED });
      return;
    }

    const user = await AuthService.getUserById(userId);
    const profile = await ProfileService.getProfile(userId);

    res.json({
      success: true,
      message: SUCCESS.USER_DATA_FETCHED,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
        profile: profile || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: ERRORS.GENERAL_ERROR });
  }
};

/**
 * Updates the profile completion status of the authenticated user.
 * @param req - The authenticated request object containing user data.
 * @param res - The response object to send the updated user data or an error message.
 * @returns A JSON response with the updated user data or an error message.
 */
export const updateProfileCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: ERRORS.USER_NOT_AUTHENTICATED });
      return;
    }

    const updatedUser = await AuthService.updateProfileCompletion(userId);

    res.json({
      success: true,
      message: SUCCESS.PROFILE_COMPLETION_UPDATED,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        isProfileComplete: updatedUser.isProfileComplete,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: ERRORS.GENERAL_ERROR });
  }
};