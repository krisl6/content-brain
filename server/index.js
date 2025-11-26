import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import ideasRouter from './routes/ideas.js';
import scriptsRouter from './routes/scripts.js';
import contentRouter from './routes/content.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/ideas', ideasRouter);
app.use('/api/scripts', scriptsRouter);
app.use('/api/content', contentRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Content Brain API is running' });
});

app.listen(PORT, () => {
  console.log(`🧠 Content Brain server running on http://localhost:${PORT}`);
});
