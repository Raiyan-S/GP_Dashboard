import React, { useState } from 'react';
import { Activity, Maximize2, X } from 'lucide-react'; // Icons from Lucide

export default function PredictionDisplay({ prediction }) {
  // This state is used to control the visibility of the modal that displays the full-size image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Results</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Image with pop-up functionality */}
          <div className="relative group">
            <img 
              src={prediction.imageUrl} 
              alt="Analyzed cell"
              className="rounded-lg w-full h-64 object-cover"
            />
            <button 
              className="absolute top-2 right-2 p-1 bg-black/50 rounded hover:bg-black/70 transition-colors"
              onClick={openModal} // Open the modal to view the image in full size
            >
              <Maximize2 className="w-4 h-4 text-white" /> {/* Icon for enlarging the image */}
            </button>
          </div>

          {/* Modal for displaying the image */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full">
                <button
                  className="absolute top-3 right-3 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={closeModal} // Close the modal when clicked
                >
                  <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </button>
                {/* Full-size image */}
                <img 
                  src={prediction.imageUrl} 
                  alt="Analyzed cell"
                  className="rounded-t-lg w-full object-contain max-h-[80vh]"
                />
              </div>
            </div>
          )}

          {/* Image details section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Image Details</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>File Name: {prediction.details.fileName}</p>
              <p>Dimensions: {prediction.details.dimensions.width} x {prediction.details.dimensions.height}px</p>
              <p>Image Type: {prediction.details.imageType}</p>
              <p>File Size: {prediction.details.fileSize}</p>
            </div>
          </div>
        </div>

        <div>
          {/* Classification result section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Classification</h4>
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {/* Icon for classification */}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Class</p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{prediction.class}</p> {/* Display the predicted class */}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</p> 
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence}%` }} // Display the confidence bar
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {prediction.confidence.toFixed(1)}% {/* Display the confidence percentage */}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Class Probabilities</p>
                {/* List of class probabilities */}
                <ul className="space-y-1 text-sm text-gray-900 dark:text-white">
                  {Object.entries(prediction.probabilities).map(([className, probability]) => (
                    <li key={className} className="flex justify-between">
                      <span>{className}</span> {/* Class name is now directly the key */}
                      <span>{(probability * 100).toFixed(2)}%</span> {/* Probability as a percentage */}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Model Date: {prediction.details.modelDate} {/* Display the model upload date */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}