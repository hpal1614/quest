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
  oliverPosition: { x: number; y: number } | null;
}

export function SpeechBubble({ riddle, onRiddleClick, delay = 3000, isVisible, oliverPosition }: SpeechBubbleProps) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowBubble(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
    }
  }, [isVisible, delay]);

  // Calculate bubble position (top-right of Oliver)
  const getBubbleStyle = () => {
    if (!oliverPosition) {
      // Fallback to fixed position if Oliver position is not available
      return { top: '8rem', right: '1.5rem' };
    }

    // Position bubble above Oliver's head
    // Oliver's position is at his center/feet, so we need to offset upward significantly
    // Offset: move left and much higher above Oliver
    return {
      left: `${oliverPosition.x - 300}px`,
      top: `${oliverPosition.y - 550}px`,
    };
  };

  return (
    <AnimatePresence>
      {showBubble && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          onClick={onRiddleClick}
          className="absolute max-w-xs z-20 cursor-pointer"
          style={getBubbleStyle()}
        >
          {/* Comic-style Speech Bubble */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-5 border-4 border-gray-800">
            {/* Riddle Text */}
            <p className="text-gray-900 text-sm font-medium leading-snug mb-3">
              "{riddle.text}"
            </p>

            {/* Tap Instruction */}
            <div className="flex items-center justify-center gap-2 text-xs text-purple-600 font-semibold animate-pulse">
              <span>👆</span>
              <span>Tap to answer and unlock location!</span>
            </div>

            {/* Speech Bubble Tail (pointing to Oliver - bottom left) */}
            <div className="absolute -bottom-6 left-8 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-gray-800"></div>
            <div className="absolute -bottom-[22px] left-[22px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[26px] border-t-white"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
