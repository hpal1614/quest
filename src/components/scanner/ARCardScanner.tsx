'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cardDetector, CardMatch } from '@/lib/scanner/card-detector';

interface ARCardScannerProps {
  onCardDetected: (cardId: string) => void;
  onClose: () => void;
}

export function ARCardScanner({ onCardDetected, onClose }: ARCardScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [lastMatch, setLastMatch] = useState<CardMatch | null>(null);
  const [detectionFrames, setDetectionFrames] = useState(0);

  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeScanner();

    return () => {
      cleanup();
    };
  }, []);

  const initializeScanner = async () => {
    try {
      setIsInitializing(true);

      // Initialize card detector
      console.log('Initializing card detection service...');
      await cardDetector.initialize();

      // Get camera access
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('Camera started successfully');
      }

      setIsInitializing(false);
      setIsScanning(true);

      // Start detection loop
      startDetection();
    } catch (err) {
      console.error('Failed to initialize scanner:', err);
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      setIsInitializing(false);
    }
  };

  const startDetection = () => {
    // Run detection every 200ms (5 fps for card detection)
    scanIntervalRef.current = setInterval(() => {
      detectCard();
    }, 200);
  };

  const detectCard = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isScanning) return;

    try {
      const match = cardDetector.detectCard(video, canvas);

      if (match && match.confidence > 0.4) {
        setLastMatch(match);
        setDetectionProgress(match.confidence * 100);

        // Require 5 consecutive frames with same card for confirmation
        setDetectionFrames(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            // Card detected successfully!
            console.log('Card confirmed:', match.cardId);
            handleCardConfirmed(match.cardId);
            return 0;
          }
          return newCount;
        });
      } else {
        // Reset if no match
        setDetectionFrames(0);
        setDetectionProgress(0);
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  const handleCardConfirmed = (cardId: string) => {
    // Stop scanning
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setIsScanning(false);

    // Notify parent
    onCardDetected(cardId);
  };

  const cleanup = () => {
    // Stop detection loop
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Close button */}
      <button
        onClick={() => {
          cleanup();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Close scanner"
      >
        <span className="text-2xl">✕</span>
      </button>

      {/* Instructions */}
      <div className="absolute top-20 left-0 right-0 z-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            🎴 Point camera at playing card
          </h2>
          <p className="text-sm text-gray-600">
            {isInitializing
              ? 'Initializing card detection...'
              : 'Hold steady when card is detected'}
          </p>

          {/* Detection progress */}
          {detectionProgress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-600">
                  Card detected! Hold steady...
                </span>
                <span className="text-xs text-gray-500">
                  {detectionFrames}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(detectionFrames / 5) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Camera View */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }} // Mirror for better UX
          />

          {/* Hidden canvas for detection */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Loading overlay */}
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Starting camera...</p>
              </div>
            </div>
          )}

          {/* Detection frame overlay */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Center guide box */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-96">
                <motion.div
                  className={`w-full h-full border-4 rounded-lg ${
                    detectionProgress > 0 ? 'border-green-500' : 'border-white/50'
                  }`}
                  animate={{
                    scale: detectionProgress > 0 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: detectionProgress > 0 ? Infinity : 0 }}
                />

                {/* Corner guides */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />

                {/* Helper text */}
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <p className="text-white text-sm font-medium">
                    Position card in frame
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Go back
            </button>
          </div>
        </div>
      )}

      {/* Status indicator */}
      {isScanning && (
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-md mx-auto flex items-center justify-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white text-sm font-medium">
              Scanning for cards...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
