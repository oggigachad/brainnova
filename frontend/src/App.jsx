import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import BatchProcessing from './components/BatchProcessing';
import EducationalInfo from './components/EducationalInfo';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('batch');

  useEffect(() => {
    // GSAP Introduction Animation
    gsap.fromTo('.app-header', 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    
    // Animate the logo
    gsap.fromTo('.brainova-logo', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    );
    
    // Floating animation for logo
    gsap.to('.logo-container', {
      y: -10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    // Subtle glow pulse
    gsap.to('.logo-glow', {
      opacity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);
  
  const tabs = [
    { id: 'batch', label: 'Batch Processing', icon: Layers },
    { id: 'info', label: 'Learn More', icon: BookOpen }
  ];
  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="app-header flex items-center justify-between mb-12">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="logo-container relative">
              <div className="logo-glow absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10 shadow-2xl">
                <img 
                  src="/Brainova.ai.png" 
                  alt="Brainova.ai Logo" 
                  className="brainova-logo h-16 w-auto object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Advanced Brain Tumor Detection System
              </p>
            </div>
          </motion.div>
          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">AI Ready</span>
            </motion.div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex gap-1 shadow-2xl shadow-blue-500/10"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl border border-blue-400/50 shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="font-medium relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </motion.div>
        </nav>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'batch' && <BatchProcessing />}
            {activeTab === 'info' && <EducationalInfo />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
