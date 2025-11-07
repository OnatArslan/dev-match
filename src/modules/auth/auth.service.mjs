import { hashPassword } from '../../utils/hash-password.mjs';
import { createAccessToken } from '../../utils/jwt.mjs';
import { prisma } from '../../lib/db.mjs';

// TODO destruct validUserData for safety
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
      username: true,
      email: true,
      createdAt: true,
    },
  });

  const accessToken = createAccessToken(user.id);

  return { user, accessToken };
}
