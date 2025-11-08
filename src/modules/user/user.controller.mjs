import { getAllUsersService } from './user.service.mjs';

export async function getAllUserController(req, res, next) {
  const users = await getAllUsersService();

  res.status(200).json({
    status: `ok`,
    message: `Listed All Users`,
    data: {
      users,
    },
  });
}
