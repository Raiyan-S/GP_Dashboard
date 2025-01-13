import { ModelPrediction } from '../types';

const sampleImages = [
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=500',
];

const classes = ['Early', 'Mid', 'Late'];

export function simulateModelPrediction(imageData: string): ModelPrediction {
  // Simulate processing delay
  const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  const confidence = 85 + Math.random() * 14; // Random confidence between 85-99%

  return {
    class: randomClass,
    confidence: Number(confidence.toFixed(1)),
    imageUrl: randomImage
  };
}