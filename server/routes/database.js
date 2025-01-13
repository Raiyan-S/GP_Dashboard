import express from 'express';
import mongoose from 'mongoose';
import Performance from '../models/Performance.js';

const router = express.Router();

router.post('/test', async (req, res) => {
  const { uri } = req.body;

  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    await conn.close();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to connect to database: ' + error.message 
    });
  }
});

router.post('/clear', async (req, res) => {
  try {
    await Performance.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to clear database: ' + error.message 
    });
  }
});

export default router;