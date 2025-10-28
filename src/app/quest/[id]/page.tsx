// Quest Detail Page - Active Quest Screen

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuestProgress } from '@/hooks/useQuestProgress';
import { useQuestStore } from '@/store/questStore';
import { getQuestById } from '@/data/quests';
import { calculateDistance, formatDistance, isWithinRadius } from '@/lib/gps/distance';
import { ProgressTracker } from '@/components/quest/ProgressTracker';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

interface QuestDetailPageProps {
  params: { id: string };
}

export default function QuestDetailPage({ params }: QuestDetailPageProps) {
  const router = useRouter();
  const quest = getQuestById(params.id);
  const { location, error: gpsError, loading: gpsLoading } = useGeolocation();
  const { startQuest } = useQuestStore();
  
  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quest Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-purple-600 hover:text-purple-700"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  const {
    progress,
    currentLocation,
    nextLocation,
    completionPercentage,
    hintsUsedAtLocation
  } = useQuestProgress(quest);

  const [distanceToCurrentLocation, setDistanceToCurrentLocation] = useState<number | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    if (location && currentLocation) {
      const distance = calculateDistance(location, currentLocation.coordinates);
      setDistanceToCurrentLocation(distance);
      setIsWithinRange(isWithinRadius(location, currentLocation.coordinates, currentLocation.radius));
    }
  }, [location, currentLocation]);

  const handleStartQuest = () => {
    if (!progress) {
      startQuest(quest.id);
    }
  };

  const handleScan = () => {
    if (isWithinRange) {
      router.push(`/scanner?questId=${quest.id}`);
    } else {
      alert(`You're ${Math.round(distanceToCurrentLocation || 0)}m away. Move within ${currentLocation?.radius}m to scan.`);
    }
  };

  const handleBack = () => {
    if (confirm('Are you sure you want to leave this quest? Your progress will be saved.')) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${quest.theme.gradient} text-white shadow-lg`}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-200"
            >
              ← Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{quest.title}</h1>
              <p className="text-sm text-white/90">Week {quest.weekNumber}</p>
            </div>
            <span className="text-3xl">{quest.theme.icon}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Progress Tracker */}
        {progress && (
          <ProgressTracker
            quest={quest}
            progress={progress}
            className="mb-6"
          />
        )}

        {/* GPS Status */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          {gpsLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Getting your location...</span>
            </div>
          )}
          
          {location && currentLocation && (
            <div>
              <div className={`flex items-center gap-2 mb-2 ${isWithinRange ? 'text-green-600' : 'text-orange-600'}`}>
                <span className="text-xl">{isWithinRange ? '✅' : '⚠️'}</span>
                <span className="text-sm font-medium">
                  {isWithinRange 
                    ? 'At Location - Ready to Scan!' 
                    : `${formatDistance(distanceToCurrentLocation || 0)} away`
                  }
                </span>
              </div>
              {!isWithinRange && distanceToCurrentLocation && (
                <p className="text-xs text-gray-600">
                  Move within {currentLocation.radius}m to scan the mascot
                </p>
              )}
            </div>
          )}
        </div>

        {/* Current Challenge */}
        {!progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Begin?</h2>
            <p className="text-gray-700 mb-4">
              {quest.description}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Head to <strong>{quest.locations[0].name}</strong> to start your adventure!
            </p>
            <button
              onClick={handleStartQuest}
              className={`w-full bg-gradient-to-r ${quest.theme.gradient} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
            >
              START QUEST
            </button>
          </motion.div>
        )}

        {progress && currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Current Challenge
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              📍 {currentLocation.name}
            </p>
            <p className="text-gray-700 italic mb-6">
              &ldquo;{currentLocation.clue}&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="py-3 px-4 border-2 border-purple-300 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors"
              >
                💡 HINT ({hintsUsedAtLocation(currentLocation.id)}/3)
              </button>
              <button
                onClick={handleScan}
                disabled={!isWithinRange}
                className={`py-3 px-4 font-bold rounded-lg transition-all ${
                  isWithinRange
                    ? 'bg-gradient-to-r ' + quest.theme.gradient + ' text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                📷 SCAN
              </button>
            </div>
          </motion.div>
        )}

        {/* Next Location Preview */}
        {nextLocation && (
          <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Next Location:</h3>
            <p className="text-sm text-gray-600">
              🔒 Complete current challenge to reveal
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

