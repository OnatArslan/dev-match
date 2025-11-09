import jwt from 'jsonwebtoken';
import { AppError } from '../lib/errors.mjs';

if (!process.env.JWT_SECRET_KEY) throw new AppError(`JWT Secret key is missing.`);
const SECRET_KEY = process.env.JWT_SECRET_KEY;
/**
 * Create access token for a given user
 * @param {object} userData - must contain id (and optionally role/email)
 * @returns {string} signed JWT token
 */

export function createAccessToken({ id, email }) {
  try {
    // JWT sign
    const token = jwt.sign(
      { id: id, email: email }, // payload
      SECRET_KEY, // secret veya private key (RS256 için PEM)
      {
        algorithm: `HS256`,
        expiresIn: 60 * 60 * 24, // 24 hour
        issuer: 'devmatch-auth-service',
        audience: 'devmatch-users',
      },
    );

    return token; // token string olarak döner
  } catch (err) {
    // jsonwebtoken bir hata atarsa
    console.error(err);
    throw new AppError(`Failed to create access token.`, 500);
  }
}
