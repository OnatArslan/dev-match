import { Router } from 'express';
import { loginLimiter } from '../../middlewares/login-rate-limit.mjs';

export const router = Router();

router.get(`/hello`, loginLimiter, async (req, res, next) => {
  res.status(200).json({
    status: `success at auth/hello test`,
  });
});
