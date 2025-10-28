// Quest List Page - Main Screen

'use client';

import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuestStore } from '@/store/questStore';
import { useUserStore } from '@/store/userStore';
import { QUESTS } from '@/data/quests';
import { Quest } from '@/types/quest';
import { calculateDistance, formatDistance, getDistanceCategory } from '@/lib/gps/distance';
import { isQuestActive } from '@/lib/utils/dateUtils';
import { QuestCard } from '@/components/quest/QuestCard';
import { PermissionRequest } from '@/components/ui/PermissionRequest';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Onboarding } from '@/components/ui/Onboarding';
import Link from 'next/link';

export default function QuestListPage() {
  const { location, error: gpsError, loading: gpsLoading } = useGeolocation();
  const { onboardingCompleted, completeOnboarding } = useUserStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [sortedQuests, setSortedQuests] = useState<Array<Quest & { distance: number }>>([]);

  useEffect(() => {
    // Check if onboarding needed
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [onboardingCompleted]);

  useEffect(() => {
    // Filter and sort quests when location is available
    if (location) {
      // Step 1: Filter by date status - only show active quests
      const activeQuests = QUESTS.filter(quest =>
        isQuestActive(quest.startDate, quest.endDate)
      );

      // Step 2: Calculate distance for active quests only
      const questsWithDistance = activeQuests.map(quest => ({
        ...quest,
        distance: calculateDistance(location, quest.locations[0].coordinates)
      }));

      // Step 3: Sort by distance (nearest first)
      questsWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedQuests(questsWithDistance);
    }
  }, [location]);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    setShowOnboarding(false);
    setShowPermissionRequest(true);
  };

  const handlePermissionGranted = () => {
    setShowPermissionRequest(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showPermissionRequest) {
    return (
      <PermissionRequest
        onGranted={handlePermissionGranted}
        onDenied={() => setShowPermissionRequest(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            The Great Sydney Quest
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Location Status */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          {gpsLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Detecting your location...</span>
            </div>
          )}
          
          {gpsError && (
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium">Location Error</p>
                <p className="text-xs">{gpsError}</p>
              </div>
            </div>
          )}
          
          {location && !gpsError && (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-xl">📍</span>
              <span className="text-sm font-medium">Your location detected</span>
            </div>
          )}
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {gpsLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading quests...</p>
            </div>
          ) : sortedQuests.length > 0 ? (
            sortedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                distance={quest.distance}
                userLocation={location}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No quests available yet</p>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-8 pb-6 flex justify-center gap-4">
          <Link 
            href="/history"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Quest History
          </Link>
          <span className="text-gray-300">•</span>
          <button
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Help
          </button>
        </div>
      </main>
    </div>
  );
}
