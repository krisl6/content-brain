import express from 'express';
import db from '../database.js';
import { generateVideoScript, generateStoryboard } from '../services/ai.js';

const router = express.Router();

// Generate video script for an idea
router.post('/generate/:ideaId', async (req, res) => {
  try {
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.ideaId);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const scriptData = await generateVideoScript(idea, platform);

    const stmt = db.prepare(`
      INSERT INTO scripts (idea_id, platform, hook, story, insight, cta, total_duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      idea.id,
      platform,
      scriptData.hook,
      scriptData.story,
      scriptData.insight,
      scriptData.cta,
      scriptData.totalDuration
    );

    const scriptId = result.lastInsertRowid;
    const newScript = db.prepare('SELECT * FROM scripts WHERE id = ?').get(scriptId);

    const storyboardScenes = await generateStoryboard(newScript, platform);

    const sceneStmt = db.prepare(`
      INSERT INTO storyboard_scenes (script_id, sequence, duration, visual_description, voiceover, camera_notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const scene of storyboardScenes) {
      sceneStmt.run(
        scriptId,
        scene.sequence,
        scene.duration,
        scene.visualDescription,
        scene.voiceover,
        scene.cameraNotes
      );
    }

    const scenes = db.prepare('SELECT * FROM storyboard_scenes WHERE script_id = ? ORDER BY sequence').all(scriptId);

    res.json({
      script: newScript,
      storyboard: scenes
    });
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all scripts for an idea
router.get('/idea/:ideaId', (req, res) => {
  try {
    const scripts = db.prepare('SELECT * FROM scripts WHERE idea_id = ? ORDER BY created_at DESC').all(req.params.ideaId);
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get script with storyboard
router.get('/:id', (req, res) => {
  try {
    const script = db.prepare('SELECT * FROM scripts WHERE id = ?').get(req.params.id);

    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    const storyboard = db.prepare('SELECT * FROM storyboard_scenes WHERE script_id = ? ORDER BY sequence').all(req.params.id);

    res.json({
      script,
      storyboard
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete script
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM scripts WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Script not found' });
    }

    res.json({ message: 'Script deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
