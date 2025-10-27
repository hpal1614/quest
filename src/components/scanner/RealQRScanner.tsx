'use client';

import { useEffect, useState } from 'react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { motion } from 'framer-motion';

interface RealQRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function RealQRScanner({ onScan, onClose }: RealQRScannerProps) {
  const { startScanning, stopScanning, isScanning, error } = useQRScanner();
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for DOM element to be fully rendered with dimensions
    let attempts = 0;
    const maxAttempts = 10;

    const checkElement = () => {
      const element = document.getElementById('qr-reader');
      if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
        console.log('QR Reader element ready:', {
          width: element.offsetWidth,
          height: element.offsetHeight
        });
        setIsReady(true);
        return true;
      }
      return false;
    };

    const timer = setInterval(() => {
      attempts++;
      if (checkElement() || attempts >= maxAttempts) {
        clearInterval(timer);
        if (attempts >= maxAttempts && !isReady) {
          console.error('QR Reader element never became ready');
          setInitError('Failed to initialize camera. Element not ready.');
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    let mounted = true;

    // Start scanning when component is ready
    const initScanner = async () => {
      try {
        // Double check element exists
        const element = document.getElementById('qr-reader');
        if (!element) {
          console.error('QR reader element not found');
          return;
        }

        console.log('Starting QR scanner...');
        await startScanning('qr-reader', (code) => {
          if (mounted) {
            console.log('QR code scanned:', code);
            // Stop scanning after successful scan
            stopScanning();
            // Pass code to parent
            onScan(code);
          }
        });
      } catch (err) {
        console.error('Failed to start scanner:', err);
        if (mounted) {
          setInitError(err instanceof Error ? err.message : 'Failed to start camera');
        }
      }
    };

    initScanner();

    // Cleanup on unmount
    return () => {
      mounted = false;
      stopScanning();
    };
  }, [isReady, startScanning, stopScanning, onScan]);

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Close button */}
      <button
        onClick={() => {
          stopScanning();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Close scanner"
      >
        <span className="text-2xl">✕</span>
      </button>

      {/* Instructions */}
      <div className="absolute top-20 left-0 right-0 z-50 px-4">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            📱 Scan QR Code
          </h2>
          <p className="text-sm text-gray-600">
            Point your camera at the QR code on the playing card
          </p>
        </div>
      </div>

      {/* QR Scanner View */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Scanner element - explicit dimensions */}
          <div
            id="qr-reader"
            className="w-full"
            style={{
              minHeight: '300px',
              minWidth: '300px',
              width: '100%',
              maxWidth: '500px'
            }}
          />

          {/* Loading state */}
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Scanning animation overlay */}
          {isScanning && (
            <motion.div
              className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Corner guides */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
        </div>
      </div>

      {/* Error message */}
      {(error || initError) && (
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{initError || error}</p>
            <button
              onClick={onClose}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Go back and try mock mode
            </button>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute bottom-24 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-white text-sm font-medium">
            {isScanning ? 'Scanning...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}
