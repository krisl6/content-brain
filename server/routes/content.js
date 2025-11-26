import express from 'express';
import db from '../database.js';
import { generateContent } from '../services/ai.js';

const router = express.Router();

// Generate content from an idea
router.post('/generate/:ideaId', async (req, res) => {
  try {
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.ideaId);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const content = await generateContent(idea);

    const stmt = db.prepare('INSERT INTO generated_content (idea_id, content_type, content) VALUES (?, ?, ?)');
    const result = stmt.run(idea.id, 'article', content);

    const newContent = db.prepare('SELECT * FROM generated_content WHERE id = ?').get(result.lastInsertRowid);
    res.json(newContent);
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all generated content for an idea
router.get('/idea/:ideaId', (req, res) => {
  try {
    const content = db.prepare('SELECT * FROM generated_content WHERE idea_id = ? ORDER BY created_at DESC').all(req.params.ideaId);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
