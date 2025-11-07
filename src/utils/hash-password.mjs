import * as argon2 from 'argon2';
import { AppError } from '../lib/errors.mjs';

export async function hashPassword(rawPassword) {
  if (!process.env.PASSWORD_PEPPER) throw new AppError(`Password Pepper Missing`, 500);

  const pepper = process.env.PASSWORD_PEPPER;
  const bufferPepper = Buffer.from(pepper, `utf-8`);
  try {
    const hash = await argon2.hash(rawPassword, {
      secret: bufferPepper,
    });
    return hash;
  } catch (err) {
    throw new AppError(`Password hashing failed!`, 500);
  }
}
