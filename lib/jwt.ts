// lib/jwt.ts
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key'; // Store in env variables for production

// Function to generate JWT token
export const generateJWT = (userId: string, name: string) => {
  return jwt.sign({ userId, name }, secretKey, { expiresIn: '1h' });
};

// Function to verify JWT token
export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Function to decode JWT token (without verification)
export const decodeJWT = (token: string) => {
  return jwt.decode(token);
};
