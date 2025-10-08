import { Router } from 'express';

export const router = Router();

router.get(`/hello`, (req, res, next) => {
  res.status(200).json({
    status: `success at auth/hello test`,
  });
});
