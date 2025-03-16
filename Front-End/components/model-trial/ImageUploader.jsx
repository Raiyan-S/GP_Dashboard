import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUploader() {
  const fileInputRef = useRef(null);

  return (
    <div>
      <div className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 dark:border-gray-600">
        <div>
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
            Supported formats: PNG, JPG, JPEG (max 5MB)
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg"
      />
    </div>
  );
}