import express from 'express';
import { config } from './config/env.js';
import { InMemoryGameStateRepository } from './repositories/in-memory-game-state.repository.js';
import { createRouter } from './routes/index.js';
import { playerIdMiddleware } from './middleware/player-id.middleware.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { logger } from './utils/logger.js';

const app = express();
const repo = new InMemoryGameStateRepository(config.dbPath, config.saveIntervalMs);

app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Player-Id');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));
app.use(playerIdMiddleware);
app.use('/', createRouter(repo));
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`Mumbai Hero server running on port ${config.port}`);
});

function shutdown() {
  logger.info('Shutting down, saving DB...');
  repo.saveToDisk();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
