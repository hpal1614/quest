// Scanner Page - AR SCANNER WITH REAL CAMERA

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuestStore } from '@/store/questStore';
import { getQuestById } from '@/data/quests';
import { validateQRCode } from '@/lib/scanner/validator';
import { calculateDistance } from '@/lib/gps/distance';
import { RealQRScanner } from '@/components/scanner/RealQRScanner';
import { MockScanner } from '@/components/scanner/MockScanner';
import { ARMascotView } from '@/components/ar/ARMascotView';
import { QuestionOverlay } from '@/components/quest/QuestionOverlay';
import { Location } from '@/types/quest';

export default function ScannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams?.get('questId');
  const useMock = searchParams?.get('mock') === 'true'; // Support mock mode for testing
  const quest = questId ? getQuestById(questId) : null;

  const { location } = useGeolocation();
  const { getQuestProgress } = useQuestStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showARMascot, setShowARMascot] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [scannedLocation, setScannedLocation] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    if (!quest) {
      router.push('/');
      return;
    }
  }, [quest, router]);

  // Calculate distance when location or scannedLocation changes
  useEffect(() => {
    if (location && scannedLocation) {
      const dist = calculateDistance(location, scannedLocation.coordinates);
      setDistance(dist);
    }
  }, [location, scannedLocation]);

  const handleScanSuccess = (scannedCode: string) => {
    if (!quest || !location) {
      setValidationError('GPS location not available');
      return;
    }

    const progress = getQuestProgress(quest.id);

    // Validate the scanned code
    const validation = validateQRCode(scannedCode, quest, progress, location);

    if (validation.isValid && validation.location) {
      // Valid scan - show AR mascot view
      setScannedLocation(validation.location);
      setShowARMascot(true);
      setValidationError(null);
    } else {
      // Invalid scan - show error
      setValidationError(validation.errorMessage || 'Invalid code');

      // Clear error after 4 seconds
      setTimeout(() => {
        setValidationError(null);
      }, 4000);
    }
  };

  const handleARMascotClick = () => {
    // User tapped speech bubble - open question overlay
    setShowARMascot(false);
    setShowQuestion(true);
  };

  const handleQuestionComplete = () => {
    setShowQuestion(false);
    setScannedLocation(null);
    router.push(`/quest/${quest?.id}`);
  };

  const handleClose = () => {
    setShowARMascot(false);
    setShowQuestion(false);
    setScannedLocation(null);
    router.back();
  };

  if (!quest) {
    return null;
  }

  // Show question overlay
  if (showQuestion && scannedLocation) {
    return (
      <QuestionOverlay
        quest={quest}
        location={scannedLocation}
        onComplete={handleQuestionComplete}
        onClose={() => {
          setShowQuestion(false);
          setShowARMascot(true); // Go back to AR view
        }}
      />
    );
  }

  // Show AR mascot view
  if (showARMascot && scannedLocation) {
    return (
      <ARMascotView
        location={scannedLocation}
        distance={distance}
        questTheme={quest.theme}
        onSpeechBubbleClick={handleARMascotClick}
        onClose={handleClose}
      />
    );
  }

  // Show scanner (real or mock)
  return (
    <>
      {useMock ? (
        <MockScanner
          onScan={handleScanSuccess}
          onClose={handleClose}
        />
      ) : (
        <RealQRScanner
          onScan={handleScanSuccess}
          onClose={handleClose}
        />
      )}

      {/* Error overlay */}
      {validationError && (
        <div className="fixed bottom-20 left-0 right-0 z-[60] px-4">
          <div className="max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{validationError}</p>
          </div>
        </div>
      )}
    </>
  );
}

