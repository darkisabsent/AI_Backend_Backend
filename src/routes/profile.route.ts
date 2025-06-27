/**
 * This file defines the routes for profile-related operations.
 * It includes routes for creating, retrieving, and updating user profiles.
 */

import { Router } from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST / - Create a new profile for the authenticated user.
 * Middleware: authenticateToken
 */
router.post('/', authenticateToken, createProfile);

/**
 * GET / - Retrieve the profile of the authenticated user.
 * Middleware: authenticateToken
 */
router.get('/', authenticateToken, getProfile);

/**
 * PUT / - Update the profile of the authenticated user.
 * Middleware: authenticateToken
 */
router.put('/', authenticateToken, updateProfile);

export default router;
