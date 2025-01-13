import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  f1Score: {
    type: Number,
    required: true
  },
  loss: {
    type: Number,
    required: true
  },
  precision: {
    type: Number,
    required: true
  },
  recall: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Performance', performanceSchema);