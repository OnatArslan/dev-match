import { registerService, loginService } from './auth.service.mjs';
import { registerUserSchema, loginSchema } from './auth.schema.mjs';
import dayjs from 'dayjs';

const cookieOptions = {
  httpOnly: true, // JS erişemez → XSS koruması
  secure: true, // sadece HTTPS'te gönderilir
  sameSite: 'strict', // CSRF önler (cross-site cookie gitmez)
  path: '/auth/refresh', // sadece refresh endpoint’inde gönderilir
  expires: dayjs().add(30, `days`).toDate(), // DB'deki expiresAt ile aynı tarih
  priority: 'high', // bazı tarayıcılarda öncelik belirtir (opsiyonel ama iyi)
};

export async function registerController(req, res, next) {
  // TODO validate request with zod
  const { email, password, passwordConfirm, username = null } = req.body;
  const validData = registerUserSchema.parse({ email, password, passwordConfirm, username });

  // TODO create user and token
  const { accessToken, user, refreshToken } = await registerService(validData);
  // TODO check user and token
  console.log(accessToken);
  console.log(user);
  // TODO check is password valid and secure
  if (!user && !accessToken) throw new AppError(`User creation or token creation is not valid`);

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
  });

  // TODO send response json data
  res.status(200).json({
    status: `Ok`,
    message: `registered successfully`,
    data: {
      user,
      accessToken,
    },
  });
}

export async function loginController(req, res, next) {
  // TODO 1: Validate incoming credentials (email/username & password) with Zod schema
  const { email, password } = req.body;
  const credentials = loginSchema.parse({ email, password });

  // TODO 2: Fetch user from database by unique field (email or username) via Prisma
  const {
    updatedValidUser: currentUser,
    accessToken,
    refreshToken,
  } = await loginService(credentials);

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
  });

  res.status(200).json({
    status: `ok`,
    message: 'login successfully',
    data: {
      accessToken,
      currentUser,
    },
  });
}

// TODO refresh controller
