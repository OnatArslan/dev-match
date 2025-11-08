import * as argon2 from 'argon2';
import { AppError } from '../lib/errors.mjs';

if (!process.env.PASSWORD_PEPPER) throw new AppError(`Password Pepper Missing`, 500);
const pepper = process.env.PASSWORD_PEPPER;
const bufferPepper = Buffer.from(pepper, `utf-8`);

const ARGON2_OPTS = {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 65536, // 64 MiB
  parallelism: 1,
  hashLength: 32,
  saltLength: 16,
};

export async function hashPassword(rawPassword) {
  try {
    const hash = await argon2.hash(rawPassword, {
      ...ARGON2_OPTS,
      secret: bufferPepper,
    });
    return hash;
  } catch (err) {
    console.log(err.message);
    throw new AppError(`Password hashing failed.`, 500);
  }
}
