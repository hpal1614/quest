'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProximityIndicator } from '../quest/ProximityIndicator';
import { Location } from '@/types/quest';

interface ARMascotViewProps {
  location: Location;
  distance: number;
  questTheme: {
    icon: string;
    color: string;
    gradient: string;
  };
  onSpeechBubbleClick: () => void;
  onClose: () => void;
}

export function ARMascotView({
  location,
  distance,
  questTheme,
  onSpeechBubbleClick,
  onClose,
}: ARMascotViewProps) {
  const questionPreview = location.question
    ? location.question.text.slice(0, 40) + (location.question.text.length > 40 ? '...' : '')
    : 'Ready to proceed!';

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Close AR view"
      >
        <span className="text-xl">✕</span>
      </button>

      <div className="h-full flex flex-col items-center justify-center p-4">
        {/* Mascot with floating animation */}
        <motion.div
          className="relative mb-8"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className={`
              w-32 h-32 rounded-full flex items-center justify-center text-7xl
              bg-gradient-to-br ${questTheme.gradient}
              shadow-2xl
            `}
          >
            {questTheme.icon}
          </div>

          {/* Glow effect */}
          <div
            className={`
              absolute inset-0 rounded-full
              bg-gradient-to-br ${questTheme.gradient}
              opacity-50 blur-xl animate-pulse
            `}
          />
        </motion.div>

        {/* Speech bubble - CLICKABLE */}
        <motion.div
          onClick={onSpeechBubbleClick}
          className="relative bg-white rounded-2xl p-6 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow mb-6 max-w-sm"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Speech bubble tail */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white" />

          <div className="space-y-2">
            <p className="text-gray-700 font-medium text-center">
              {questionPreview}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Tap to answer</span>
              <span className="animate-bounce">→</span>
            </div>
          </div>

          {/* Pulse animation ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-4 border-blue-400"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* GPS Proximity Indicator */}
        <ProximityIndicator distance={distance} className="max-w-sm w-full" />

        {/* Location name badge */}
        <div className="mt-4 px-4 py-2 bg-white/90 rounded-full shadow-lg">
          <p className="text-sm font-semibold text-gray-700">
            📍 {location.name}
          </p>
        </div>
      </div>
    </div>
  );
}
