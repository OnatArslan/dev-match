import jwt from 'jsonwebtoken';
import { AppError } from '../lib/errors.mjs';

/**
 * Create access token for a given user
 * @param {object} userData - must contain id (and optionally role/email)
 * @returns {string} signed JWT token
 */
export function createAccessToken(userData) {
  try {
    // JWT sign
    const token = jwt.sign(
      { id: userData.id }, // payload
      process.env.JWT_SECRET_KEY, // secret veya private key (RS256 için PEM)
      {
        algorithm: `HS256`,
        expiresIn: '1d', //
        issuer: 'devmatch-auth',
        audience: 'devmatch-users',
      },
    );

    return token; // token string olarak döner
  } catch (err) {
    // jsonwebtoken bir hata atarsa
    throw new AppError(`Failed to create access token: ${err.message}`, 500);
  }
}
