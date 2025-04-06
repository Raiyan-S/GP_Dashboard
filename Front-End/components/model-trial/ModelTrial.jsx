import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Trash2, Upload, Loader2 } from 'lucide-react'; // Icons from Lucide
import { predict } from '../../services/api'; // Importing the predict function from the API service

// Components for displaying prediction results and history
import PredictionDisplay from './PredictionResult';
import PredictionHistory from './PredictionHistory'; 

// Mapping class labels to human-readable names
const CLASSES = {
  class_0: 'Benign',
  class_1: 'Early Stage Malignant',
  class_2: 'Premalignant',
  class_3: 'Progressive Malignant',
};

// Constants for session storage keys
const STORAGE_KEY = 'model-predictions';
const COUNTER_KEY = 'prediction-counter';

export default function ModelTrial() {
  // State variables for managing predictions, counter, selected prediction, processing state, and error messages
  const [predictions, setPredictions] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [counter, setCounter] = useState(() => {
    const saved = sessionStorage.getItem(COUNTER_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input element

  // Save to sessionStorage when predictions or counter change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
    sessionStorage.setItem(COUNTER_KEY, counter.toString());
  }, [predictions, counter]);

  // Validate the uploaded file
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }
    if (file.size > maxSize) {
      return `File size must be less than 5 MB`;
    }
    return null;
  };

  // Handle image upload and prediction
  // This function is called when a file is selected
  const handleImageUpload = async (file) => {
    const validationError = validateFile(file); // Validate the file before processing
    if (validationError) { // If validation fails, set the error state and return
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const prediction = await predict(file); // Call the predict function from the API service

      console.log('Prediction result:', prediction); // Log the prediction result for debugging

      const newId = counter + 1; // Increment the counter for the new prediction

      const fileSizeInMB = file.size / 1024 / 1024; // Convert file size to MB

      // Store the prediction result in a structured format
      // The result object contains the prediction class, confidence, probabilities, and image details
      const result = {
        id: newId,
        class: CLASSES[prediction.prediction],
        confidence: prediction.confidence * 100, // Convert to percentage
        probabilities: Object.fromEntries(
          Object.entries(prediction.probabilities).map(([key, value]) => [CLASSES[key], value])
        ),
        imageUrl: URL.createObjectURL(file),
        details: {
          modelDate: prediction.model_upload_date,
          imageType: prediction.image_format,
          fileName: file.name,
          dimensions: {
        width: prediction.image_size[0],
        height: prediction.image_size[1],
          },
          fileSize: fileSizeInMB < 1 
        ? (file.size / 1024).toFixed(2) + ' KB' 
        : fileSizeInMB.toFixed(2) + ' MB',
        },
      };
      // Set the new prediction in the state and update the selected prediction
      setPredictions((prev) => [result, ...prev]);
      setSelectedPrediction(newId);
      setCounter(newId);
    } catch {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear the prediction history
  // This function is called when the "Clear History" button is clicked
  const clearHistory = () => {
    setPredictions([]);
    setSelectedPrediction(null);
    setCounter(0);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(COUNTER_KEY);
  };

  // Find the current prediction based on selection or default to the most recent
  const currentPrediction =
    predictions.find((p) =>
      selectedPrediction ? p.id === selectedPrediction : p.id === predictions[0]?.id
    ) || null;

  
  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-900/30">
        {/* Header for the model classification section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cell Classification Model</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload microscopic cell images for automated classification
          </p>
        </div>
        
        <div className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 dark:border-gray-600">
          {/* Display a loading spinner while processing the image */}     
          {isProcessing ? (
            <div className="py-4">
              <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Processing image...</p>
            </div>
          ) : (
            <>
            {/* Show the instructions and clickable text when not processing */}
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                <button
                  className="text-blue-500 dark:text-blue-400 font-medium mx-1 hover:text-blue-600 dark:hover:text-blue-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse
                </button>
                to choose a file
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: PNG, JPG, JPEG (max 5MB) 
              </p>
            </>
          )}
        </div>
        
        {/* Display error messages if any */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Hidden file input for selecting images */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          disabled={isProcessing}
        />

        {/* Display the prediction result if available */}
        {currentPrediction && <PredictionDisplay prediction={currentPrediction} />}
      </div>

      {/* Prediction history section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis History</h3>
          {/* Clear history button */}
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

        {/* Display the prediction history */}
        <PredictionHistory
          predictions={predictions}
          selectedId={selectedPrediction}
          onSelect={setSelectedPrediction}
        />
      </div>
    </div>
  );
}