import { Router } from 'express';
import { loginLimiter } from '../../middlewares/login-rate-limit.mjs';
import { getAllUserController, registerController } from './auth.controller.mjs';

export const router = Router();

router.post(`/register`, registerController);

router.get(`/`, getAllUserController);
