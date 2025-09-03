import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import crypto from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

import { logger } from './lib/logger.mjs';
import { notFoundHandler } from './middlewares/not-found.mjs';
import { errorHandler } from './middlewares/error-handler.mjs';

export const app = express();
const isProd = process.env.NODE_ENV === 'production';

/* ───────────────────────────── App basics ───────────────────────────── */
if (process.env.TRUST_PROXY != null) {
  const raw = String(process.env.TRUST_PROXY).trim().toLowerCase();
  let trust;

  if (raw === 'true')
    trust = true; // tüm proxy’lere güven
  else if (raw === 'false' || raw === '')
    trust = false; // hiç güvenme (lokal dev)
  else if (/^\d+$/.test(raw))
    trust = Number(raw); // hop sayısı (örn: 1)
  else trust = raw; // 'loopback', 'linklocal', 'uniquelocal' veya CIDR/IP listesi

  app.set('trust proxy', trust);
}

app.set('query parser', 'simple');
app.disable('x-powered-by');

if (!isProd) app.set('json spaces', 2);

/* ─────────────── Security & Middleware ─────────────── */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

app.use(
  cors({
    origin: true, // prod’da whitelist'e çevir
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  }),
);

app.use(compression());

/* ─────────────── Body Parsers ─────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use(cookieParser());

// hpp yi body parserlardan sonra kullanmak gerek
app.use(hpp({ checkBody: true }));

/* ─────────────── Request ID + HTTP Logger ─────────────── */
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

const morganStream = { write: (msg) => logger.info(msg.trim(), { channel: 'http' }) };
app.use(
  morgan(isProd ? 'combined' : 'dev', {
    stream: morganStream,
    skip: (req) => req.path === '/health',
  }),
);

/* ─────────────── Rate limiting ─────────────── */
// Rate limitte auth tarafini daha kontrollu tutmak daha mantikli (brut force)
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
    },
    // Dev’de local’i istersen es geç; prod’da kapalı tut
    skip: (req) => process.env.NODE_ENV !== 'production' && req.ip === '127.0.0.1',
  }),
);

/* ─────────────── Healthcheck ─────────────── */
app.get('/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

/* ─────────────── (Import Routers Here) ─────────────── */
/* ─────────────── (Routes) ─────────────── */
// örn: app.use('/api/auth', authRoutes);

/* ─────────────── Not Found & Error ─────────────── */
app.use(notFoundHandler); // eşleşmeyen tüm istekler buraya düşer
app.use(errorHandler); // tüm hatalar burada sonlanır
