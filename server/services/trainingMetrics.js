import TrainingRound from '../models/TrainingRound.js';

export async function getAllRounds() {
  try {
    return await TrainingRound.find()
      .sort({ created_at: -1 })
      .lean();
  } catch (error) {
    console.error('Error fetching all rounds:', error);
    return [];
  }
}

export async function getRoundsByClient(clientId) {
  try {
    return await TrainingRound.find({
      'clients.client_id': clientId
    })
      .sort({ created_at: -1 })
      .lean();
  } catch (error) {
    console.error(`Error fetching rounds for client ${clientId}:`, error);
    return [];
  }
}

export async function getRoundById(roundId) {
  try {
    return await TrainingRound.findOne({
      round_id: roundId
    }).lean();
  } catch (error) {
    console.error(`Error fetching round ${roundId}:`, error);
    return null;
  }
}

export async function getAggregatedStats() {
  try {
    const stats = await TrainingRound.aggregate([
      { $unwind: '$clients' },
      {
        $group: {
          _id: null,
          totalRounds: { $addToSet: '$round_id' },
          avgAccuracy: { $avg: '$clients.metrics.accuracy' },
          avgF1Score: { $avg: '$clients.metrics.f1_score' },
          avgLoss: { $avg: '$clients.metrics.loss' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRounds: { $size: '$totalRounds' },
          avgAccuracy: 1,
          avgF1Score: 1,
          avgLoss: 1
        }
      }
    ]);

    return stats[0] || null;
  } catch (error) {
    console.error('Error fetching aggregated stats:', error);
    return null;
  }
}