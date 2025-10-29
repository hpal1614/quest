'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  riddle: {
    text: string;
    answer: string;
    hints: string[];
  };
  onRiddleClick: () => void;
  delay?: number; // Delay before showing bubble (in ms)
  isVisible: boolean;
}

export function SpeechBubble({ riddle, onRiddleClick, delay = 3000, isVisible }: SpeechBubbleProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowBubble(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
      setCurrentHintIndex(0);
    }
  }, [isVisible, delay]);

  const handleHintClick = () => {
    if (currentHintIndex < riddle.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const getHintButtonText = () => {
    if (currentHintIndex >= riddle.hints.length - 1) {
      return 'No more hints';
    }
    return `💡 Hint ${currentHintIndex + 1}/${riddle.hints.length}`;
  };

  return (
    <AnimatePresence>
      {showBubble && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.2 
          }}
          className="absolute bottom-20 left-4 right-4 z-20"
        >
          {/* Speech Bubble */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            {/* Bubble Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤔</span>
                <h3 className="font-bold text-lg">Riddle Time!</h3>
              </div>
            </div>
            
            {/* Riddle Text */}
            <div className="p-6">
              <p className="text-gray-800 text-lg font-medium mb-4 leading-relaxed">
                "{riddle.text}"
              </p>
              
              {/* Current Hint */}
              {currentHintIndex < riddle.hints.length && (
                <motion.div
                  key={currentHintIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r-lg"
                >
                  <p className="text-blue-800 text-sm">
                    <span className="font-semibold">Hint:</span> {riddle.hints[currentHintIndex]}
                  </p>
                </motion.div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleHintClick}
                  disabled={currentHintIndex >= riddle.hints.length - 1}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    currentHintIndex >= riddle.hints.length - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                  }`}
                >
                  {getHintButtonText()}
                </button>
                
                <button
                  onClick={onRiddleClick}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all"
                >
                  Answer Riddle
                </button>
              </div>
            </div>
          </div>
          
          {/* Speech Bubble Tail */}
          <div className="relative">
            <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-45"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
