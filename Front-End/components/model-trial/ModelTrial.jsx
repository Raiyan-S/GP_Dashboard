import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PredictionDisplay from './PredictionResult';
import PredictionHistory from './PredictionHistory';
import { AlertCircle, Trash2 } from 'lucide-react';
import { predict } from '../../services/api'; 

const CLASSES = {
  class_0: 'Benign',
  class_1: 'Early Stage Malignant',
  class_2: 'Premalignant',
  class_3: 'Progressive Malignant',
};

const STORAGE_KEY = 'model-predictions';
const COUNTER_KEY = 'prediction-counter';

export default function ModelTrial() {
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [counter, setCounter] = useState(() => {
    const saved = localStorage.getItem(COUNTER_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Save to localStorage when predictions or counter change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
    localStorage.setItem(COUNTER_KEY, counter.toString());
  }, [predictions, counter]);

  const handleImageUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const prediction = await predict(file);

      console.log("Prediction result:", prediction);

      const newId = counter + 1;
      
      const result = {
        id: newId,
        class: CLASSES[prediction.prediction],
        confidence: prediction.confidence * 100, // Convert to percentage
        imageUrl: URL.createObjectURL(file),
        details: {
          phase: CLASSES[prediction.prediction],
          modelDate: prediction.model_date,
          imageType: prediction.image_format,
          dimensions: {
            width: prediction.image_size[0],
            height: prediction.image_size[1],
          },
        },
      };
      setPredictions(prev => [result, ...prev]);
      setSelectedPrediction(newId);
      setCounter(newId);
    } catch {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearHistory = () => {
    setPredictions([]);
    setSelectedPrediction(null);
    setCounter(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COUNTER_KEY);
  };

  // Find the current prediction based on selection or default to the most recent
  const currentPrediction = predictions.find(p => 
    selectedPrediction ? p.id === selectedPrediction : p.id === predictions[0]?.id
  ) || null;

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-900/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cell Classification Model</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload microscopic cell images for automated classification
          </p>
        </div>

        <ImageUploader 
          onImageUpload={handleImageUpload}
          isProcessing={isProcessing}
          accept="image/png,image/jpeg"
          maxSize={5 * 1024 * 1024}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {currentPrediction && <PredictionDisplay prediction={currentPrediction} />}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis History</h3>
          {predictions.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear History
            </button>
          )}
        </div>
        <PredictionHistory 
          predictions={predictions} 
          selectedId={selectedPrediction}
          onSelect={setSelectedPrediction}
        />
      </div>
    </div>
  );
}