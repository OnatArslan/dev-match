// ------------------------------------------------------------
// File: src/middlewares/not-found.mjs
// ------------------------------------------------------------
import createError from 'http-errors';

// Route eşleşmeyince 404 oluşturup error pipeline'a gönder
function notFoundHandler(_req, _res, next) {
  next(createError(404, 'Route not found'));
}

export default notFoundHandler;
