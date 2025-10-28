'use client';

import React from 'react';

interface ProximityIndicatorProps {
  distance: number;
  className?: string;
}

export function ProximityIndicator({ distance, className = '' }: ProximityIndicatorProps) {
  const getProximityLevel = () => {
    if (distance <= 10) {
      return {
        emoji: '🔥🔥🔥',
        text: 'Very close!',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
    if (distance <= 30) {
      return {
        emoji: '🔥🔥',
        text: 'Getting warmer',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    if (distance <= 50) {
      return {
        emoji: '🔥',
        text: 'Nearby',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
    if (distance <= 100) {
      return {
        emoji: '👣',
        text: 'Not far',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
    return {
      emoji: '🧭',
      text: 'Keep searching',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  const level = getProximityLevel();

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border-2
        ${level.bgColor} ${level.borderColor} ${className}
        transition-all duration-300 animate-pulse
      `}
    >
      <span className="text-2xl" role="img" aria-label="proximity">
        {level.emoji}
      </span>
      <div className="flex flex-col">
        <span className={`font-semibold ${level.color}`}>
          {level.text}
        </span>
        <span className="text-xs text-gray-600">
          {distance.toFixed(0)}m away
        </span>
      </div>
    </div>
  );
}
