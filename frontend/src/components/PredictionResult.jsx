import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PredictionResult = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center py-12"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Activity className="w-16 h-16 text-indigo-400" />
            </motion.div>
          </div>
          <h3 className="text-xl font-semibold">Analyzing Brain Scan...</h3>
          <p className="text-white/70">Using advanced AI to detect tumors</p>
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  const { predicted_class_name, confidence, predictions, device } = result;
  
  // Prepare data for pie chart
  const chartData = predictions.map(pred => ({
    name: pred.className,
    value: pred.probability,
    color: pred.info.color
  }));

  const mainPrediction = predictions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: mainPrediction.info.color + '20' }}
            >
              {mainPrediction.class === 'notumor' ? (
                <CheckCircle className="w-8 h-8" style={{ color: mainPrediction.info.color }} />
              ) : (
                <AlertCircle className="w-8 h-8" style={{ color: mainPrediction.info.color }} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{predicted_class_name}</h2>
              <p className="text-white/70">Primary Detection</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: mainPrediction.info.color }}>
              {confidence.toFixed(1)}%
            </p>
            <p className="text-sm text-white/70">Confidence</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Confidence Level</span>
            <span className="font-semibold">{confidence.toFixed(2)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${mainPrediction.info.color}, ${mainPrediction.info.color}dd)`
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            About {predicted_class_name}
          </h4>
          <p className="text-white/80 text-sm leading-relaxed">
            {mainPrediction.info.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-white/10 rounded-full">
              Severity: <strong>{mainPrediction.info.severity}</strong>
            </span>
            <span className="text-white/60">
              Processed on: <strong>{device}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Probability Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* All Predictions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">All Classifications</h3>
          <div className="space-y-3">
            {predictions.map((pred, index) => (
              <motion.div
                key={pred.class}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{pred.className}</span>
                  <span className="font-bold" style={{ color: pred.info.color }}>
                    {pred.probability.toFixed(2)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.probability}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: pred.info.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionResult;
