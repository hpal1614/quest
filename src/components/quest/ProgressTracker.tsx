// Progress Tracker Component

'use client';

import { Quest, UserProgress } from '@/types/quest';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  quest: Quest;
  progress: UserProgress;
  className?: string;
}

export function ProgressTracker({ quest, progress, className = '' }: ProgressTrackerProps) {
  const totalLocations = quest.locations.length;
  const completedCount = progress.completedLocationIds.length;
  const percentage = (completedCount / totalLocations) * 100;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Progress</h2>
        <span className="text-sm font-medium text-gray-600">
          {completedCount}/{totalLocations} Stops
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${quest.theme.gradient}`}
        />
      </div>

      {/* Location Dots */}
      <div className="flex justify-between items-center">
        {quest.locations.map((location, index) => {
          const isCompleted = progress.completedLocationIds.includes(location.id);
          const isCurrent = location.id === progress.currentLocationId;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={location.id} className="flex flex-col items-center">
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                    ? 'bg-white border-purple-500 text-purple-500 ring-4 ring-purple-200'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </motion.div>

              {/* Label */}
              <span className={`text-xs mt-2 text-center max-w-[60px] ${
                isCurrent ? 'font-bold text-gray-900' : 'text-gray-600'
              }`}>
                {location.type === 'start' ? 'Start' : location.type === 'finish' ? 'Finish' : `Stop ${index}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


