/**
 * @fileoverview Defines routes for authentication-related operations such as login, registration, and profile management.
 */

import { Router } from 'express';
import {
  login,
  logout,
  refreshAccessToken,
  register,
  getUserWithProfile,
  updateProfileCompletion,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Authentication routes
router.post('/register', register); // Handles user registration
router.post('/login', login); // Handles user login
router.post('/refresh', refreshAccessToken); // Refreshes access token
router.post('/logout', logout); // Logs out the user

// User and profile routes
router.get('/user', authenticateToken, getUserWithProfile); // Retrieves user data with profile
router.put('/profile-completion', authenticateToken, updateProfileCompletion); // Updates profile completion status

export default router;

