// Question Overlay Component with Progressive Hints

'use client';

import { useState, useEffect } from 'react';
import { Quest, Location } from '@/types/quest';
import { useQuestStore } from '@/store/questStore';
import { matchAnswer } from '@/lib/utils/fuzzyMatch';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionOverlayProps {
  quest: Quest;
  location: Location;
  onComplete: () => void;
  onClose: () => void;
}

export function QuestionOverlay({ quest, location, onComplete, onClose }: QuestionOverlayProps) {
  const { updateProgress, addHint, getQuestProgress, completeQuest } = useQuestStore();
  const progress = getQuestProgress(quest.id);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showMascot, setShowMascot] = useState(true);

  const hintsUsed = progress?.hintsUsed[location.id] || 0;

  useEffect(() => {
    setCurrentHintLevel(hintsUsed);
  }, [hintsUsed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !location.question) return;

    const correct = matchAnswer(
      userAnswer,
      location.question.answer,
      location.question.alternativeAnswers
    );

    if (correct) {
      // Correct answer!
      setIsCorrect(true);
      setShowFeedback(true);

      // Update progress
      if (location.type === 'finish') {
        // Quest complete!
        const voucherCode = `SQ-${quest.id.substring(7, 9).toUpperCase()}-${Date.now().toString(36)}`;
        completeQuest(quest.id, voucherCode);
        
        // Redirect to completion screen after delay
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Move to next location
        const currentIndex = quest.locations.findIndex(l => l.id === location.id);
        const nextLocation = quest.locations[currentIndex + 1];
        
        if (nextLocation) {
          updateProgress(quest.id, nextLocation.id);
        }

        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } else {
      // Wrong answer - show hint
      setIsCorrect(false);
      setShowFeedback(true);
      
      // Add hint if not at max
      if (currentHintLevel < 3) {
        addHint(quest.id, location.id);
        setCurrentHintLevel(currentHintLevel + 1);
      }

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer('');
      }, 3000);
    }
  };

  const handleRequestHint = () => {
    if (currentHintLevel < 3 && location.question) {
      addHint(quest.id, location.id);
      setCurrentHintLevel(currentHintLevel + 1);
    }
  };

  const getCurrentHint = (): string | null => {
    if (!location.question || currentHintLevel === 0) return null;
    const hintIndex = Math.min(currentHintLevel - 1, 2);
    return location.question.hints[hintIndex];
  };

  if (!location.question) {
    // Start location - no question
    updateProgress(quest.id, location.id);
    setTimeout(() => {
      onComplete();
    }, 1000);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Mascot Animation (if showing) */}
        <AnimatePresence>
          {showMascot && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="text-center py-8 bg-gradient-to-b from-purple-100 to-white"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-8xl mb-4"
              >
                {quest.theme.icon}
              </motion.div>
              <button
                onClick={() => setShowMascot(false)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Tap to answer →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Form */}
        {!showMascot && (
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            {/* Challenge Number */}
            <div className="text-sm text-purple-600 font-bold mb-2">
              CHALLENGE #{quest.locations.findIndex(l => l.id === location.id) + 1}
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {location.question.text}
            </h2>

            {/* Answer Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Type your answer..."
                  disabled={showFeedback && isCorrect}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!userAnswer.trim() || (showFeedback && isCorrect)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900 font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                SUBMIT ANSWER
              </button>
            </form>

            {/* Hint Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  💡 Hints Used: {currentHintLevel}/3
                </span>
                {currentHintLevel < 3 && (
                  <button
                    onClick={handleRequestHint}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Need a Hint?
                  </button>
                )}
              </div>

              {/* Current Hint */}
              {getCurrentHint() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <p className="text-sm text-yellow-900">
                    <strong>Hint:</strong> {getCurrentHint()}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-lg ${
                    isCorrect
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className={`font-bold mb-1 ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {isCorrect ? 'CORRECT!' : 'Not Quite...'}
                      </p>
                      {isCorrect ? (
                        <p className="text-sm text-green-800">
                          Great job! {location.type === 'finish' 
                            ? 'Quest complete!' 
                            : 'Moving to next location...'}
                        </p>
                      ) : (
                        <p className="text-sm text-red-800">
                          Try again with the hint!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}


