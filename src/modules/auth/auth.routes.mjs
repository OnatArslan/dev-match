import { Router } from 'express';
import { loginController, refreshController, registerController } from './auth.controller.mjs';

export const router = Router();

router.post(`/register`, registerController);
router.post(`/login`, loginController);
router.post(`/refresh`, refreshController);
