import { prisma } from '../../lib/db.mjs';

export async function getAllUsersService() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
    },
    take: 10,
  });

  return users;
}
