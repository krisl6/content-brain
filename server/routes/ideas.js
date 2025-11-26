import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all ideas
router.get('/', (req, res) => {
  try {
    const ideas = db.prepare('SELECT * FROM ideas ORDER BY created_at DESC').all();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single idea
router.get('/:id', (req, res) => {
  try {
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new idea
router.post('/', (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';

    const stmt = db.prepare('INSERT INTO ideas (title, content, tags) VALUES (?, ?, ?)');
    const result = stmt.run(title, content, tagsString);

    const newIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newIdea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update idea
router.put('/:id', (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';

    const stmt = db.prepare('UPDATE ideas SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(title, content, tagsString, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const updatedIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete idea
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM ideas WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
