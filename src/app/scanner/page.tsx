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
  const { progress, currentLocation, updateProgress } = useQuestProgress(quest!);
  
  // AR State - Auto-start AR immediately
  const [isARActive, setIsARActive] = useState(true); // Changed to true
  const [isMarkerDetected, setIsMarkerDetected] = useState(false);
  const [isMascotLoaded, setIsMascotLoaded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!quest) {
      router.push('/');
      return;
    }
    // Auto-start AR when page loads
    setIsARActive(true);
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
  const isARButtonActive = progress && currentLocation;

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
    
    if (isCorrect && currentLocation && quest) {
      // Move to next location
      const currentIndex = quest.locations.findIndex(loc => loc.id === currentLocation.id);
      const nextLocation = quest.locations[currentIndex + 1];
      
      if (nextLocation) {
        updateProgress(quest.id, nextLocation.id);
      }
      
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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Floating Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* AR Scene - Fullscreen */}
      <AnimatePresence>
        {isARActive && currentLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
              <ARScene
                markerFile={currentLocation.arRiddle?.markerFile || '/assets/mind-file/postcard.mind'}
                mascotModel={currentLocation.arRiddle?.mascotModel || '/assets/Oliver/biped/Character_output.glb'}
                onMarkerDetected={handleMarkerDetected}
                onMarkerLost={handleMarkerLost}
                onMascotLoaded={handleMascotLoaded}
                isPaused={isPaused}
              />

              {/* Speech Bubble */}
              {isMarkerDetected && isMascotLoaded && currentLocation.arRiddle && (
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
      {currentLocation?.arRiddle && (
        <OverlayModal
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          riddle={currentLocation.arRiddle}
          onAnswerSubmit={handleAnswerSubmit}
          questTheme={quest.theme}
        />
      )}
    </div>
  );
}