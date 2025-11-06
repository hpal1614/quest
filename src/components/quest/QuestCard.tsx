// QuestCard Component - Exact implementation from technical-architecture.md

'use client';

import { Quest, Coordinates } from '@/types/quest';
import { formatDistance, getDistanceCategory } from '@/lib/gps/distance';
import { isQuestActive, isQuestUpcoming, isQuestExpired, formatDate } from '@/lib/utils/dateUtils';
import { useQuestStore } from '@/store/questStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface QuestCardProps {
  quest: Quest;
  distance: number;
  userLocation: Coordinates | null;
}

export function QuestCard({ quest, distance, userLocation }: QuestCardProps) {
  const router = useRouter();
  const { hasCompletedQuest, getQuestProgress } = useQuestStore();
  const isCompleted = hasCompletedQuest(quest.id);
  const inProgress = getQuestProgress(quest.id);

  // Date validation
  const isDateActive = isQuestActive(quest.startDate, quest.endDate);
  const isUpcoming = isQuestUpcoming(quest.startDate);
  const isExpired = isQuestExpired(quest.endDate);

  // Distance validation
  const category = getDistanceCategory(distance);

  // Quest is available only if: within range AND dates are active AND not expired
  // Demo quests bypass GPS requirements
  const isAvailable = quest.isDemo ? isDateActive && !isExpired : (category === 'available' && isDateActive && !isExpired);

  const handleClick = () => {
    // Check date restrictions first
    if (isExpired) {
      alert(`This quest ended on ${formatDate(quest.endDate)}. Check back for new quests!`);
      return;
    }

    if (isUpcoming) {
      alert(`This quest starts on ${formatDate(quest.startDate)}. Come back then!`);
      return;
    }

    // Check if can proceed to quest
    if (isAvailable || inProgress) {
      router.push(`/quest/${quest.id}`);
    } else if (category === 'nearby') {
      alert(`You're ${formatDistance(distance)} away. Head to ${quest.locations[0].name} to unlock this quest.`);
    } else {
      alert(`This quest starts at ${quest.locations[0].name}. You're too far to begin.`);
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <span className="text-lg">✓</span>
          <span className="text-sm font-medium">Completed</span>
        </div>
      );
    }
    if (inProgress) {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <span className="text-lg">▶</span>
          <span className="text-sm font-medium">In Progress</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <span className="text-lg">⭐</span>
        <span className="text-sm font-medium">Not Started</span>
      </div>
    );
  };

  const cardClasses = `
    relative rounded-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden
    ${isAvailable
      ? 'bg-gradient-to-r ' + quest.theme.gradient + ' text-gray-900 scale-105 shadow-2xl'
      : category === 'nearby'
      ? 'bg-white text-gray-800 shadow-md hover:shadow-lg'
      : 'bg-gray-100 text-gray-500 opacity-60'}
  `;

  return (
    <motion.div
      className={cardClasses}
      onClick={handleClick}
      whileHover={{ scale: isAvailable ? 1.08 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isAvailable ? { 
        boxShadow: [
          '0 10px 30px rgba(255, 107, 107, 0.3)',
          '0 10px 40px rgba(255, 107, 107, 0.5)',
          '0 10px 30px rgba(255, 107, 107, 0.3)',
        ]
      } : {}}
      transition={{ duration: 2, repeat: isAvailable ? Infinity : 0 }}
    >
      {/* Background decoration */}
      {isAvailable && (
        <div className="absolute top-0 right-0 text-6xl opacity-20">
          {quest.theme.icon}
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{quest.theme.icon}</span>
              <h3 className={`text-xl font-bold ${isAvailable ? 'text-gray-900' : ''}`}>
                {quest.title}
              </h3>
            </div>
            <p className={`text-sm ${isAvailable ? 'text-gray-800' : 'text-gray-600'}`}>
              Week {quest.weekNumber}
            </p>
          </div>
          {!isAvailable && category === 'far' && (
            <span className="text-2xl">🔒</span>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm mb-4 ${isAvailable ? 'text-gray-800' : 'text-gray-700'}`}>
          {quest.description}
        </p>

        {/* Status Info */}
        <div className="flex items-center justify-between mb-3">
          <div className={`text-sm ${isAvailable ? 'text-gray-700' : 'text-gray-600'}`}>
            {quest.isDemo ? '📍 Demo (No GPS required)' : `📍 ${formatDistance(distance)} away`}
          </div>
          {getStatusBadge()}
        </div>

        {/* Duration */}
        <p className={`text-xs mb-4 ${isAvailable ? 'text-gray-700' : 'text-gray-500'}`}>
          ⏱️ Est. {quest.estimatedDuration} minutes
        </p>

        {/* Action Button */}
        {isAvailable && (
          <button 
            className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/quest/${quest.id}`);
            }}
          >
            {inProgress ? 'CONTINUE QUEST' : 'START QUEST'}
          </button>
        )}

        {category === 'nearby' && (
          <div className={`text-sm ${isAvailable ? 'text-white/80' : 'text-gray-500'}`}>
            Get within 50m to start
          </div>
        )}
      </div>
    </motion.div>
  );
}


