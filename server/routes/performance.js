import express from 'express';
import {
  getAllRounds,
  getRoundsByClient,
  getRoundById,
  getAggregatedStats
} from '../services/trainingMetrics.js';

const router = express.Router();

// Get all performance data with optional client filtering
router.get('/', async (req, res) => {
  try {
    const { client_id } = req.query;
    const data = client_id 
      ? await getRoundsByClient(client_id)
      : await getAllRounds();

    // Transform data to match existing API format
    const transformedData = data.map(round => {
      const clientData = client_id
        ? round.clients.find(c => c.client_id === client_id)
        : round.clients[0];

      return {
        round: round.round_id,
        timestamp: round.created_at,
        accuracy: clientData.metrics.accuracy * 100, // Convert to percentage
        f1Score: clientData.metrics.f1_score * 100,
        loss: clientData.metrics.loss,
        precision: clientData.metrics.f1_score, // Derived from f1_score for compatibility
        recall: clientData.metrics.f1_score // Derived from f1_score for compatibility
      };
    });

    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await getAggregatedStats();
    if (!stats) {
      return res.json({
        totalRounds: 0,
        avgAccuracy: 0,
        avgF1Score: 0,
        avgLoss: 0
      });
    }

    // Transform stats to match existing API format
    const transformedStats = {
      totalRounds: stats.totalRounds,
      avgAccuracy: stats.avgAccuracy * 100,
      avgF1Score: stats.avgF1Score * 100,
      avgLoss: stats.avgLoss
    };

    res.json(transformedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific round data
router.get('/round/:roundId', async (req, res) => {
  try {
    const round = await getRoundById(req.params.roundId);
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }
    res.json(round);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;