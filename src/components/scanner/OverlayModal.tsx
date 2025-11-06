'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  riddle: {
    text: string;
    answer: string;
    hints: string[];
  };
  onAnswerSubmit: (answer: string) => void;
  questTheme: {
    gradient: string;
    icon: string;
  };
}

export function OverlayModal({ 
  isOpen, 
  onClose, 
  riddle, 
  onAnswerSubmit, 
  questTheme 
}: OverlayModalProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = userAnswer.toLowerCase().trim() === riddle.answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    // Call parent callback
    onAnswerSubmit(userAnswer);
    
    // Auto-close after showing result
    setTimeout(() => {
      onClose();
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    }, 3000);
  };

  const handleClose = () => {
    onClose();
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 z-[101] flex items-center justify-center pointer-events-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${questTheme.gradient} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{questTheme.icon}</span>
                    <h2 className="text-xl font-bold text-gray-900">Riddle Challenge</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-900 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {!showResult ? (
                  <>
                    {/* Riddle Display */}
                    <div className="mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 text-lg font-medium leading-relaxed">
                          "{riddle.text}"
                        </p>
                      </div>
                      
                      {/* Hints */}
                      <div className="space-y-2">
                        {riddle.hints.map((hint, index) => (
                          <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                            <p className="text-blue-800 text-sm">
                              <span className="font-semibold">Hint {index + 1}:</span> {hint}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Answer Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Answer:
                      </label>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        autoFocus
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim()}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                          userAnswer.trim()
                            ? `bg-gradient-to-r ${questTheme.gradient} text-gray-900 shadow-lg hover:shadow-xl active:scale-95`
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Answer
                      </button>

                      {/* Back to Scan Button */}
                      <button
                        onClick={handleClose}
                        className="w-full py-3 px-6 rounded-lg font-medium text-gray-700 border-2 border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        ← Back to Scan
                      </button>
                    </div>
                  </>
                ) : (
                  /* Result Display */
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                      className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isCorrect ? '🎉' : '❌'}
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </h3>
                    
                    {isCorrect ? (
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          You're on the right track! Next clue unlocked.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 font-medium">
                            ✅ Location completed successfully!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          The correct answer was: <strong>{riddle.answer}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Don't worry, you can try again!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
