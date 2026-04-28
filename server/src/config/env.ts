import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  dbPath: process.env['DB_PATH'] ?? path.resolve(__dirname, '../../data/db.json'),
  saveIntervalMs: 5000,
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
};
