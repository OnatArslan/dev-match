import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const router = Router();

router.route(`/`).get((req, res, next) => {
  res.status(StatusCodes.OK).json({ status: `ok`, message: `Base user route` });
});
