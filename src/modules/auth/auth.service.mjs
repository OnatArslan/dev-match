import { hashPassword } from '../../utils/hash-password.mjs';
import { createAccessToken, createRefreshToken } from '../../utils/jwt.mjs';
import { prisma } from '../../lib/db.mjs';
import { AppError } from '../../lib/errors.mjs';
import { verifyPassword } from '../../utils/verify-password.mjs';
import dayjs from 'dayjs';
import { createHash } from 'node:crypto';

export async function registerService({ email, password, username = null }) {
  const hash = await hashPassword(password);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email,
          username: username,
          passwordHash: hash,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLoginAt: new Date(),
        },
        omit: {
          passwordHash: true,
          passwordChangedAt: true,
        },
      });

      const accessToken = createAccessToken({ id: updatedUser.id, email: updatedUser.email });

      const refreshToken = createRefreshToken({ id: updatedUser.id, email: updatedUser.email });

      const expiresAt = dayjs().add(30, `day`).toDate();
      const hashedRefreshToken = createHash(`sha256`).update(refreshToken).digest(`hex`);

      await tx.refreshToken.create({
        data: {
          tokenHash: hashedRefreshToken,
          userId: updatedUser.id,
          expiresAt: expiresAt,
        },
      });
      return { updatedUser, accessToken, refreshToken };
    });

    return result;
  } catch (err) {
    console.log(err);
    if (err.code === `P2002`) throw new AppError(`Email or username was taken.`);
    throw new AppError(`Token creation or register failed`);
  }
}

export async function loginService({ email, password }) {
  // TODO 1️⃣ Fetch user by email or username (select id, passwordHash, status, verifiedAt, role)
  let user;
  try {
    user = await prisma.user.findFirstOrThrow({
      where: {
        email: email,
        status: `ACTIVE`,
        role: {
          not: `ADMIN`,
        },
        deletedAt: null,
      },
    });
  } catch (err) {
    if (err.code === `P2025`) throw new AppError('Invalid Credentials.');
    throw new AppError(`Something went wrong.`);
  }
  // TODO 3️⃣ Verify password via verifyPassword(rawPassword, user.passwordHash) → throw AppError on mismatch
  const check = await verifyPassword(password, user.passwordHash);
  if (!check) throw new AppError(`Invalid credentials`);

  const result = await prisma.$transaction(async (tx) => {
    const oldRefreshToken = await tx.refreshToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (
      oldRefreshToken &&
      oldRefreshToken.revoked === false &&
      oldRefreshToken.expiresAt > new Date()
    ) {
      throw new AppError(`Already logged in. Please check auth/refresh route`, 409);
    }

    const updatedValidUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
      omit: { passwordHash: true },
    });

    const accessToken = createAccessToken({
      id: updatedValidUser.id,
      email: updatedValidUser.email,
    });
    const refreshToken = createRefreshToken({
      id: updatedValidUser.id,
      email: updatedValidUser.email,
    });

    const expiresAt = dayjs().add(30, `day`).toDate();
    const hashedRefreshToken = createHash(`sha256`).update(refreshToken).digest(`hex`);

    try {
      await tx.refreshToken.upsert({
        where: {
          userId: updatedValidUser.id,
        },
        create: {
          tokenHash: hashedRefreshToken,
          userId: updatedValidUser.id,
          expiresAt: expiresAt,
        },
        update: {
          expiresAt: expiresAt,
          tokenHash: hashedRefreshToken,
          revoked: false,
        },
      });
    } catch (err) {
      console.log(err);
      throw new AppError(`Refresh token creation failed`);
    }

    return { accessToken, updatedValidUser, refreshToken };
  });

  return result;
}

export async function refreshTokenService(req) {
  const refreshToken = req.cookie?.refreshToken;
  if (!refreshToken || refreshToken === ' ') {
    throw new AppError(`Refresh token is missing`);
  }

  const result = await prisma.$transaction(async (tx) => {
    // TODO get refresh token (prisma)
    // get valid fields
    // TODO get user
    // hide hash
  });
}
