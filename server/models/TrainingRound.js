import mongoose from 'mongoose';

const MetricsSchema = new mongoose.Schema({
  accuracy: {
    type: Number,
    required: true
  },
  f1_score: {
    type: Number,
    required: true
  },
  loss: {
    type: Number,
    required: true
  }
});

const ClientMetricsSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: true
  },
  metrics: {
    type: MetricsSchema,
    required: true
  }
});

const TrainingRoundSchema = new mongoose.Schema({
  round_id: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  clients: [ClientMetricsSchema]
});

// Create a compound index for better query performance
TrainingRoundSchema.index({ created_at: -1, round_id: 1 });
TrainingRoundSchema.index({ 'clients.client_id': 1 });

const TrainingRound = mongoose.model('TrainingRound', TrainingRoundSchema);

export default TrainingRound;