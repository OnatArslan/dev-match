import { Router } from 'express';

export const router = Router();

router.get('/test', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
