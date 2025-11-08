import { registerService } from './auth.service.mjs';
import { registerUserSchema } from './auth.schema.mjs';

export async function registerController(req, res, next) {
  // TODO validate request with zod
  const { email, password, passwordConfirm, username = null } = req.body;
  const validData = registerUserSchema.parse({ email, password, passwordConfirm, username });

  // TODO create user and token
  const { accessToken, user } = await registerService(validData);
  // TODO check user and token
  console.log(accessToken);
  console.log(user);
  // TODO check is password valid and secure
  if (!user && !accessToken) throw new AppError(`User creation or token creation is not valid`);
  // TODO send response cookies (token)
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // JS tarafından erişilemez (XSS koruması)
    secure: true, // Sadece HTTPS bağlantılarında gönderilir
    sameSite: 'strict', // CSRF’e karşı koruma
    maxAge: 24 * 60 * 60 * 1000, // 1 gün (ms cinsinden)             // Cookie’nin geçerli olduğu path
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
