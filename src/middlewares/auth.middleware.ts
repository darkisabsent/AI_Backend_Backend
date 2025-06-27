/**
 * @fileoverview Middleware for authenticating user tokens in requests.
 */

import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils/authenticate';
import { ENV } from '../config/env';
import { ERRORS } from '../utils/error-messages';

/**
 * Middleware to authenticate the user's access token.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function in the stack.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log(ERRORS.ACCESS_TOKEN_MISSING);
    res.status(401).json({ message: ERRORS.ACCESS_TOKEN_MISSING });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: number };
    console.log('Decoded token:', decoded);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.log(ERRORS.INVALID_OR_EXPIRED_TOKEN, err);
    res.status(403).json({ message: ERRORS.INVALID_OR_EXPIRED_TOKEN });
  }
};