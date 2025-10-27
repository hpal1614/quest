// Scanner Page - MOCK SCANNER FOR TESTING

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuestStore } from '@/store/questStore';
import { getQuestById } from '@/data/quests';
import { validateQRCode } from '@/lib/scanner/validator';
import { MockScanner } from '@/components/scanner/MockScanner';
import { QuestionOverlay } from '@/components/quest/QuestionOverlay';

export default function ScannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams?.get('questId');
  const quest = questId ? getQuestById(questId) : null;

  const { location } = useGeolocation();
  const { getQuestProgress } = useQuestStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [scannedLocation, setScannedLocation] = useState<any>(null);

  useEffect(() => {
    if (!quest) {
      router.push('/');
      return;
    }
  }, [quest, router]);

  const handleScanSuccess = (scannedCode: string) => {
    if (!quest || !location) return;

    const progress = getQuestProgress(quest.id);
    
    // Validate the scanned code
    const validation = validateQRCode(scannedCode, quest, progress, location);

    if (validation.isValid && validation.location) {
      // Valid scan - show question overlay
      setScannedLocation(validation.location);
      setShowQuestion(true);
      setValidationError(null);
    } else {
      // Invalid scan - show error
      setValidationError(validation.errorMessage || 'Invalid code');
    }
  };

  const handleQuestionComplete = () => {
    setShowQuestion(false);
    router.push(`/quest/${quest?.id}`);
  };

  const handleClose = () => {
    router.back();
  };

  if (!quest) {
    return null;
  }

  if (showQuestion && scannedLocation) {
    return (
      <QuestionOverlay
        quest={quest}
        location={scannedLocation}
        onComplete={handleQuestionComplete}
        onClose={() => {
          setShowQuestion(false);
          setValidationError(null);
        }}
      />
    );
  }

  return (
    <>
      <MockScanner
        onScan={handleScanSuccess}
        onClose={handleClose}
      />
      
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

