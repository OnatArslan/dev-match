import { Router } from 'express';
import { loginController, registerController } from './auth.controller.mjs';

export const router = Router();

router.post(`/register`, registerController);
router.post(`/login`, loginController);
