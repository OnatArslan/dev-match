// File: src/lib/errors.mjs
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   */
  constructor(message = 'Something went wrong', statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = 'AppError';
    this.status = statusCode; // senin errorHandler 'status' veya 'statusCode' okuyor
    this.statusCode = statusCode;
    this.code = getReasonPhrase(statusCode).toUpperCase().replace(/\s/g, '_'); // örn: 404 -> NOT_FOUND

    Error.captureStackTrace?.(this, AppError);
  }
}
