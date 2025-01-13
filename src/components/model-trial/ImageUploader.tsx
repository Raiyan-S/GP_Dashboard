import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
  accept: string;
  maxSize: number;
}

export default function ImageUploader({ 
  onImageUpload, 
  isProcessing,
  accept,
  maxSize 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }
    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onImageUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="py-4">
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Processing image...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Drag and drop your microscopic cell image here, or
              <button 
                className="text-blue-500 dark:text-blue-400 font-medium mx-1 hover:text-blue-600 dark:hover:text-blue-300"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
              to choose a file
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: PNG, JPG, JPEG (max {maxSize / (1024 * 1024)}MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
        disabled={isProcessing}
      />
    </div>
  );
}