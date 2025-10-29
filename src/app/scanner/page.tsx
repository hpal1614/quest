// Scanner Page - AR Scavenger Hunt

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuestProgress } from '@/hooks/useQuestProgress';
import { getQuestById } from '@/data/quests';
import { calculateDistance, isWithinRadius } from '@/lib/gps/distance';
import { ARButton } from '@/components/scanner/ARButton';
import { ARScene } from '@/components/scanner/ARScene';
import { SpeechBubble } from '@/components/scanner/SpeechBubble';
import { OverlayModal } from '@/components/scanner/OverlayModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams?.get('questId');
  const quest = questId ? getQuestById(questId) : null;
  
  const { location } = useGeolocation();
  const { progress, currentLocation, completeLocation } = useQuestProgress(quest!);
  
  // AR State
  const [isARActive, setIsARActive] = useState(false);
  const [isMarkerDetected, setIsMarkerDetected] = useState(false);
  const [isMascotLoaded, setIsMascotLoaded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!quest) {
      router.push('/');
      return;
    }
  }, [quest, router]);

  // Check if user is within range of current location
  const isWithinRange = location && currentLocation 
    ? isWithinRadius(location, currentLocation.coordinates, currentLocation.radius)
    : false;

  const distanceToLocation = location && currentLocation
    ? calculateDistance(location, currentLocation.coordinates)
    : null;

  // Check if AR is available for current location
  const hasARRiddle = currentLocation?.arRiddle;
  const isARButtonActive = progress && currentLocation && hasARRiddle;

  const handleStartAR = () => {
    setIsARActive(true);
    setIsPaused(false);
  };

  const handleMarkerDetected = () => {
    setIsMarkerDetected(true);
  };

  const handleMarkerLost = () => {
    setIsMarkerDetected(false);
  };

  const handleMascotLoaded = () => {
    setIsMascotLoaded(true);
  };

  const handleRiddleClick = () => {
    setIsOverlayOpen(true);
    setIsPaused(true);
  };

  const handleAnswerSubmit = (answer: string) => {
    // Check if answer is correct
    const isCorrect = answer.toLowerCase().trim() === currentLocation?.arRiddle?.answer.toLowerCase();
    
    if (isCorrect && currentLocation) {
      // Complete the location
      completeLocation(currentLocation.id);
      
      // Show success message
      setTimeout(() => {
        alert('🎉 Correct! Location completed! Next clue unlocked.');
        router.back(); // Go back to quest detail page
      }, 1000);
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setIsPaused(false);
  };

  const handleBack = () => {
    if (confirm('Are you sure you want to leave? Your AR progress will be lost.')) {
      router.back();
    }
  };

  if (!quest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-200 text-xl"
            >
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{quest.title}</h1>
              <p className="text-sm text-white/90">
                {currentLocation?.name || 'Loading...'}
              </p>
            </div>
            <span className="text-3xl">{quest.theme.icon}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* GPS Status */}
        <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white">
          <div className={`flex items-center gap-2 mb-2 ${isWithinRange ? 'text-green-300' : 'text-yellow-300'}`}>
            <span className="text-xl">{isWithinRange ? '✅' : '⚠️'}</span>
            <span className="text-sm font-medium">
              {isWithinRange 
                ? 'At Location - Ready for AR!' 
                : `${Math.round(distanceToLocation || 0)}m away`
              }
            </span>
          </div>
          {!isWithinRange && distanceToLocation && (
            <p className="text-xs text-white/80">
              Move within {currentLocation?.radius}m to start AR
            </p>
          )}
        </div>

        {/* AR Button */}
        {!isARActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ARButton
              isActive={!!isARButtonActive}
              isWithinRange={isWithinRange}
              distance={distanceToLocation || undefined}
              radius={currentLocation?.radius}
              onStartAR={handleStartAR}
              questTheme={quest.theme}
            />
          </motion.div>
        )}

        {/* AR Scene */}
        <AnimatePresence>
          {isARActive && currentLocation?.arRiddle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <ARScene
                markerFile={currentLocation.arRiddle.markerFile}
                mascotModel={currentLocation.arRiddle.mascotModel}
                onMarkerDetected={handleMarkerDetected}
                onMarkerLost={handleMarkerLost}
                onMascotLoaded={handleMascotLoaded}
                isPaused={isPaused}
              />

              {/* Speech Bubble */}
              {isMarkerDetected && isMascotLoaded && (
                <SpeechBubble
                  riddle={currentLocation.arRiddle}
                  onRiddleClick={handleRiddleClick}
                  delay={2000}
                  isVisible={!isOverlayOpen}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay Modal */}
        <OverlayModal
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          riddle={currentLocation?.arRiddle!}
          onAnswerSubmit={handleAnswerSubmit}
          questTheme={quest.theme}
        />
      </main>
    </div>
  );
}