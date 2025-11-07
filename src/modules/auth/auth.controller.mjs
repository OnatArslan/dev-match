import { registerService } from './auth.service.mjs';

export async function registerController(req, res, next) {
  // TODO validate request with zod
  // TODO create user and token

  // TODO check user and token

  // TODO check is password valid and secure

  // TODO send response cookies (token)

  // TODO send response json data
  res.status(200).json({
    status: `Ok`,
    message: `registered successfully`,
  });
}
