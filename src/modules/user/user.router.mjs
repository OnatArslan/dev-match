import { Router } from 'express';
import { getAllUserController } from './user.controller.mjs';

export const router = Router();

router.get(`/`, getAllUserController);
