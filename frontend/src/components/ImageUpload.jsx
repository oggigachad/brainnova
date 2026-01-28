import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUpload = ({ onImageSelect, mode = 'single' }) => {
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [mode]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (mode === 'single' && imageFiles.length > 0) {
      const file = imageFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else if (mode === 'batch') {
      const newPreviews = [];
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({ file, preview: reader.result });
          if (newPreviews.length === imageFiles.length) {
            setPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
      onImageSelect(imageFiles);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {mode === 'single' && !preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-purple-400 bg-purple-500/20'
              : 'border-white/30 hover:border-purple-400 bg-white/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <Upload className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Brain MRI Scan</h3>
              <p className="text-white/70">
                Drag and drop or click to select an image
              </p>
              <p className="text-sm text-white/50 mt-2">
                Supported formats: JPG, PNG, JPEG
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {mode === 'single' && preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative card overflow-hidden"
        >
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-96 object-contain rounded-xl"
          />
          <div className="mt-4 text-center">
            <p className="text-white/70">Image ready for analysis</p>
          </div>
        </motion.div>
      )}

      {mode === 'batch' && (
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6 ${
              isDragging
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-white/30 hover:border-purple-400 bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-purple-400" />
              <p className="text-lg">Drop multiple images here or click to select</p>
              <p className="text-sm text-white/50">Upload up to 10 scans at once</p>
            </div>
          </motion.div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative card p-2"
                >
                  <button
                    onClick={() => removePreview(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
