import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // --> In 10 min only 5 right to try
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});
