import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import logger from '../lib/logger.mjs';

const isProd = process.env.NODE_ENV === 'production';

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = Number(err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  if (isNaN(status) || status < 100 || status > 599) {
    status = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // Eğer err.message boşsa, HTTP reason phrase kullan
  const message =
    !isProd || status < 500 ? err.message || getReasonPhrase(status) : 'Internal Server Error';

  const payload = {
    message,
    statusCode: status,
    path: req.originalUrl,
    method: req.method,
  };

  if (!isProd) payload.stack = err.stack;

  logger.error(`${req.method} ${req.originalUrl} -> ${status} ${message}`, {
    stack: err.stack,
    path: payload.path,
    method: payload.method,
  });

  res.status(status).json(payload);
}

export default errorHandler;
