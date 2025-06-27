/**
 * @fileoverview Centralized error and success messages for consistent responses.
 */

export const ERRORS = {
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  PROFILE_DATA_EMPTY: 'Profile data cannot be empty',
  PROFILE_ALREADY_EXISTS: 'Profile already exists',
  PROFILE_NOT_FOUND: 'Profile not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  REFRESH_TOKEN_MISSING: 'Refresh token missing',
  REFRESH_TOKEN_INVALID: 'Refresh token invalid or expired',
  LOGOUT_ERROR: 'An error occurred during logout',
  ACCESS_TOKEN_MISSING: 'Access token missing',
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
  USER_ALREADY_EXISTS: 'User already exists',
  GENERAL_ERROR: 'An error occurred',
};

export const SUCCESS = {
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_FETCHED: 'Profile fetched successfully',
  LOGGED_OUT: 'Logged out successfully',
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_LOGGED_OUT: 'User logged out successfully',
  ACCESS_TOKEN_REFRESHED: 'Access token refreshed successfully',
  PROFILE_COMPLETION_UPDATED: 'Profile completion status updated successfully',
  USER_DATA_FETCHED: 'User data fetched successfully',
};
