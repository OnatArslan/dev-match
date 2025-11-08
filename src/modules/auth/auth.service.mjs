import { hashPassword } from '../../utils/hash-password.mjs';
import { createAccessToken } from '../../utils/jwt.mjs';
import { prisma } from '../../lib/db.mjs';

export async function registerService({ email, password, username = null }) {
  const hash = await hashPassword(password);

  const user = await prisma.user.create({
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

  const accessToken = createAccessToken(user);

  return { user, accessToken };
}
