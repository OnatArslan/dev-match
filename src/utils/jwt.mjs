import jwt from 'jsonwebtoken';
import { AppError } from '../lib/errors.mjs';

if (!process.env.JWT_SECRET_KEY) throw new AppError(`JWT Secret key is missing.`);
const SECRET_KEY = process.env.JWT_SECRET_KEY;
/**
 * Create access token for a given user
 * @param {object} userData - must contain id (and optionally role/email)
 * @returns {string} signed JWT token
 */

const TOKEN_OPTIONS = {
  algorithm: `HS256`,
  issuer: 'devmatch-auth-service',
  audience: 'devmatch-users',
};

export function createAccessToken({ id, email }) {
  try {
    // JWT sign
    const accessToken = jwt.sign(
      { id: id, email: email }, // payload
      SECRET_KEY, // secret veya private key (RS256 için PEM)
      {
        ...TOKEN_OPTIONS,
        expiresIn: 60 * 60 * 3, // 3 hours
      },
    );

    return accessToken; // token string olarak döner
  } catch (err) {
    // jsonwebtoken bir hata atarsa
    console.error(err);
    throw new AppError(`Failed to create access token.`, 500);
  }
}

export function createRefreshToken({ id, email }) {
  try {
    const refreshToken = jwt.sign({ id, email }, SECRET_KEY, {
      ...TOKEN_OPTIONS,
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    });

    return refreshToken;
  } catch (err) {
    console.error(err);
    throw new AppError(`Failed to create refresh token`, 500);
  }
}
