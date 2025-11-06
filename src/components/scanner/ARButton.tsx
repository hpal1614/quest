'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ARButtonProps {
  isActive: boolean;
  isWithinRange: boolean;
  distance?: number;
  radius?: number;
  onStartAR: () => void;
  questTheme: {
    gradient: string;
    icon: string;
  };
}

export function ARButton({ 
  isActive, 
  isWithinRange, 
  distance, 
  radius, 
  onStartAR, 
  questTheme 
}: ARButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (isActive && isWithinRange) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onStartAR();
    }
  };

  const getButtonText = () => {
    if (!isActive) return 'Complete Previous Location';
    if (!isWithinRange) return `Move Within ${radius}m`;
    return 'Start AR';
  };

  const getButtonIcon = () => {
    if (!isActive) return '🔒';
    if (!isWithinRange) return '📍';
    return '📷';
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!isActive || !isWithinRange}
      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
        isActive && isWithinRange
          ? `bg-gradient-to-r ${questTheme.gradient} text-gray-900 shadow-lg hover:shadow-xl active:scale-95`
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      whileTap={isActive && isWithinRange ? { scale: 0.95 } : {}}
      animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl">{getButtonIcon()}</span>
        <span>{getButtonText()}</span>
      </div>
      
      {!isWithinRange && distance && (
        <div className="mt-2 text-sm opacity-75">
          {Math.round(distance)}m away
        </div>
      )}
    </motion.button>
  );
}
