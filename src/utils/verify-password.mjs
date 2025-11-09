import * as argon2 from 'argon2';
import { AppError } from '../lib/errors.mjs';

const pepperEnv = process.env.PASSWORD_PEPPER;
if (!pepperEnv) {
  throw new AppError('Missing PASSWORD_PEPPER in environment variables', 500);
}

// Cache pepper buffer at module load
const pepperBuffer = Buffer.from(pepperEnv, 'utf-8');

export async function verifyPassword(rawPassword, hash) {
  try {
    return await argon2.verify(hash, rawPassword, {
      secret: pepperBuffer,
    });
  } catch (err) {
    console.error(err);
    throw new AppError(`Internal error on password validation!`);
  }
}
