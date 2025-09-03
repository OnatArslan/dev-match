import http from 'node:http';
import app from './app.mjs';
import logger from './lib/logger.mjs';
import chalk from 'chalk';

// ENV ve PORT degiskenleri rahat kullanim icin
const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
const raw = process.env.PORT ?? '3000';
const PORT = Number.isFinite(Number(raw)) ? Number(raw) : 3000;

// HTTP server'ı app.mjs (Express) üzerine kur
const server = http.createServer(app);

// Dinleme
server.listen(PORT, () => {
  logger.info(`🚀 Server listening on port ${PORT}`, {
    env: ENV,
    port: PORT,
  });
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      chalk.green.bold('🚀 DevMatch server is up and running!') +
        '\n' +
        chalk.cyan(`   ➜  Local:   `) +
        chalk.white(`http://localhost:${PORT}/`) +
        '\n' +
        chalk.cyan(`   ➜  Health:  `) +
        chalk.white(`http://localhost:${PORT}/health`) +
        '\n' +
        chalk.gray(`   (Press CTRL+C to quit)\n`),
    );
  }
});

// Sunucu hataları (örn. EADDRINUSE, EACCES)
server.on('error', (err) => {
  logger.error(`Server error on listen: ${err.message}`, { stack: err.stack });
  // Başlangıçta patladıysa çık; aksi hâlde graceful shutdown tetiklenebilir
  process.exit(1);
});

// Graceful shutdown helper
async function shutdown(signal) {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);
  // Yeni bağlantı alma
  server.close((closeErr) => {
    if (closeErr) {
      logger.error(`Error during server.close(): ${closeErr.message}`, { stack: closeErr.stack });
      process.exit(1);
    }
    logger.info('HTTP server closed. Bye 👋');
    process.exit(0);
  });

  // Emniyet: 10sn içinde kapanmazsa zorla çık
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

// Process sinyalleri
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Yakalanmamış promise reddi
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  // Prod'da güvenli taraf: süreçten çık (çekirdek yeniden başlatır / orchestrator alır)
  if (isProd) shutdown('unhandledRejection');
});

// Yakalanmamış exception
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  // Prod'da güvenli taraf: süreçten çık
  if (isProd) shutdown('uncaughtException');
});
