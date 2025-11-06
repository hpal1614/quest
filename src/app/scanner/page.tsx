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
import { CompletionModal } from '@/components/scanner/CompletionModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams?.get('questId');
  const quest = questId ? getQuestById(questId) : null;
  
  const { location } = useGeolocation();
  const { progress, currentLocation, updateProgress, completeQuest } = useQuestProgress(quest!);

  // Debug: Log current location info
  useEffect(() => {
    console.log('📍 Current Location Debug:', {
      currentLocationId: progress?.currentLocationId,
      currentLocationName: currentLocation?.name,
      hasArRiddle: !!currentLocation?.arRiddle,
      arRiddleData: currentLocation?.arRiddle
    });
  }, [progress, currentLocation]);
  
  // AR State - Auto-start AR immediately
  const [isARActive, setIsARActive] = useState(true); // Changed to true
  const [isMarkerDetected, setIsMarkerDetected] = useState(false);
  const [isMascotLoaded, setIsMascotLoaded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [oliverPosition, setOliverPosition] = useState<{ x: number; y: number } | null>(null);

  // Completion state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    console.log('🚀 [STEP 1] Scanner Page Initialized');
    console.log('   → Quest:', quest?.title);
    console.log('   → Current Location:', currentLocation?.name);
    console.log('   → Has AR Riddle:', !!currentLocation?.arRiddle);

    if (!quest) {
      console.log('❌ [ERROR] No quest found, redirecting to home');
      router.push('/');
      return;
    }
    // Auto-start AR when page loads
    console.log('✅ [STEP 1] Auto-starting AR...');
    setIsARActive(true);
  }, [quest, router]);

  // Check if user is within range of current location
  // Demo quests bypass GPS requirements
  const isWithinRange = quest?.isDemo
    ? true
    : location && currentLocation
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
    console.log('🎯 [STEP 2] Marker detected!');
    console.log('   → Setting isMarkerDetected = true');
    console.log('   → Mascot should now be visible');
    setIsMarkerDetected(true);
  };

  const handleMarkerLost = () => {
    console.log('❌ [MARKER LOST] User moved camera away from marker');
    console.log('   → Setting isMarkerDetected = false');
    console.log('   → Mascot will be hidden');
    setIsMarkerDetected(false);
  };

  const handleMascotLoaded = () => {
    console.log('✅ [STEP 3] Mascot (Oliver) loaded successfully!');
    console.log('   → Setting isMascotLoaded = true');
    console.log('   → Speech bubble should appear soon (2 second delay)');
    setIsMascotLoaded(true);
  };

  const handleOliverPositionUpdate = (x: number, y: number) => {
    // Only log occasionally to avoid spam
    setOliverPosition({ x, y });
  };

  const handleRiddleClick = () => {
    console.log('💬 [STEP 4] User tapped on speech bubble');
    console.log('   → Opening riddle overlay modal');
    console.log('   → Pausing AR (isPaused = true)');
    console.log('   → AR rendering will pause to save resources');
    setIsOverlayOpen(true);
    setIsPaused(true);
  };

  const generateVoucherCode = () => {
    // Generate a unique voucher code
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `COFFEE-${timestamp}-${random}`;
  };

  const handleAnswerSubmit = (answer: string) => {
    console.log('📝 [STEP 5] User submitted answer:', answer);
    // Check if answer is correct
    const isCorrect = answer.toLowerCase().trim() === currentLocation?.arRiddle?.answer.toLowerCase();
    console.log('   → Correct answer:', currentLocation?.arRiddle?.answer);
    console.log('   → Is correct?', isCorrect);

    if (isCorrect && currentLocation && quest) {
      console.log('✅ [STEP 6] Correct answer! Moving to next location...');
      // Move to next location
      const currentIndex = quest.locations.findIndex(loc => loc.id === currentLocation.id);
      const nextLocation = quest.locations[currentIndex + 1];

      console.log('   → Current location index:', currentIndex);
      console.log('   → Next location:', nextLocation?.name || 'FINISH');

      if (nextLocation) {
        // Not the last location - move to next
        updateProgress(quest.id, nextLocation.id);
        console.log('   → Progress updated to:', nextLocation.id);

        // Show success message
        setTimeout(() => {
          alert('🎉 Correct! Location completed! Next clue unlocked.');
          console.log('   → Redirecting back to quest page...');
          router.back(); // Go back to quest detail page
        }, 1000);
      } else {
        // Last location - quest complete!
        console.log('🎊 QUEST COMPLETE! Showing completion modal...');

        // Generate voucher code
        const code = generateVoucherCode();
        setVoucherCode(code);

        // Mark quest as complete in store
        completeQuest(quest.id, code);

        // Close riddle overlay and show completion modal
        setIsOverlayOpen(false);
        setTimeout(() => {
          setIsCompletionModalOpen(true);
        }, 500);
      }
    } else {
      console.log('❌ [INCORRECT] Wrong answer provided');
    }
  };

  const handleCloseOverlay = () => {
    console.log('🔙 [BACK TO SCAN] User closed overlay');
    console.log('   → Closing overlay (isOverlayOpen = false)');
    console.log('   → Resuming AR (isPaused = false)');
    console.log('   → User can scan marker again');
    setIsOverlayOpen(false);
    setIsPaused(false);
  };

  const handleBack = () => {
    if (confirm('Are you sure you want to leave? Your AR progress will be lost.')) {
      router.back();
    }
  };

  const handleCompletionClose = () => {
    console.log('🏁 Quest completed, redirecting to home...');
    setIsCompletionModalOpen(false);
    router.push('/'); // Go back to quest list
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
                mascotModel={currentLocation.arRiddle?.mascotModel || '/assets/Oliver/biped/Meshy_Merged_Animations.glb'}
                onMarkerDetected={handleMarkerDetected}
                onMarkerLost={handleMarkerLost}
                onMascotLoaded={handleMascotLoaded}
                isPaused={isPaused}
                onOliverPositionUpdate={handleOliverPositionUpdate}
                hideUI={isOverlayOpen}
              />

              {/* Speech Bubble */}
              {(() => {
                console.log('💬 Speech Bubble Check:', {
                  isMarkerDetected,
                  isMascotLoaded,
                  hasArRiddle: !!currentLocation?.arRiddle,
                  isOverlayOpen,
                  shouldShow: isMarkerDetected && isMascotLoaded && !!currentLocation?.arRiddle
                });
                return null;
              })()}
              {isMarkerDetected && isMascotLoaded && currentLocation?.arRiddle && (
                <SpeechBubble
                  riddle={currentLocation.arRiddle}
                  onRiddleClick={handleRiddleClick}
                  delay={2000}
                  isVisible={!isOverlayOpen}
                  oliverPosition={oliverPosition}
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

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCompletionClose}
        questTitle={quest.title}
        voucherCode={voucherCode}
        questTheme={quest.theme}
      />
    </div>
  );
}