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
    this.statusText = statusCode < 500 ? `fail` : `error`; // senin errorHandler 'status' veya 'statusCode' okuyor
    this.statusCode = statusCode;
    try {
      this.code = getReasonPhrase(statusCode).toUpperCase().replace(/\s/g, '_'); // örn: 404 -> NOT_FOUND
    } catch (err) {
      this.code = `UNKNOWN_ERROR`;
    }
    this.isOperational = true;

    Error.captureStackTrace?.(this, AppError);
  }
}
