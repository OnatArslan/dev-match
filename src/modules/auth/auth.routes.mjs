import { Router } from 'express';

export const router = Router();

router.get(`/hello`, async (req, res, next) => {
  res.status(200).json({
    status: `success at auth/hello test`,
  });
});
