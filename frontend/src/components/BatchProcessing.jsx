import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, TrendingUp } from 'lucide-react';
import ImageUpload from './ImageUpload';
import axios from 'axios';

const BatchProcessing = () => {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagesSelect = (files) => {
    if (files) {
      setImages(files);
      setResults(null);
    }
  };

  const handleBatchPredict = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();
    images.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/predict-batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Batch prediction error:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSummary = () => {
    if (!results) return null;

    const summary = {
      glioma: 0,
      meningioma: 0,
      notumor: 0,
      pituitary: 0
    };

    results.results.forEach(result => {
      summary[result.predicted_class]++;
    });

    return summary;
  };

  const summary = getSummary();

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Batch Processing</h2>
            <p className="text-white/70">Analyze multiple scans simultaneously</p>
          </div>
        </div>

        <ImageUpload onImageSelect={handleImagesSelect} mode="batch" />

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              onClick={handleBatchPredict}
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2" />
                  Processing {images.length} images...
                </>
              ) : (
                `Analyze ${images.length} Image${images.length > 1 ? 's' : ''}`
              )}
            </button>
          </motion.div>
        )}
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Statistics */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Batch Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                <p className="text-red-300 text-sm mb-1">Glioma</p>
                <p className="text-3xl font-bold">{summary.glioma}</p>
              </div>
              <div className="p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <p className="text-orange-300 text-sm mb-1">Meningioma</p>
                <p className="text-3xl font-bold">{summary.meningioma}</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                <p className="text-green-300 text-sm mb-1">No Tumor</p>
                <p className="text-3xl font-bold">{summary.notumor}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <p className="text-purple-300 text-sm mb-1">Pituitary</p>
                <p className="text-3xl font-bold">{summary.pituitary}</p>
              </div>
            </div>
          </div>

          {/* Individual Results */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Individual Results</h3>
            <div className="space-y-3">
              {results.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-12 rounded-full"
                      style={{ backgroundColor: result.color }}
                    />
                    <div>
                      <p className="font-medium">{result.filename}</p>
                      <p className="text-sm text-white/70">{result.predicted_class_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: result.color }}>
                      {result.confidence.toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/60">confidence</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BatchProcessing;
