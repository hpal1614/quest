// useQRScanner Hook

'use client';

import { useState, useEffect, useCallback } from 'react';
import { qrScannerService } from '@/lib/scanner/qr-scanner';

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isScanning) {
        qrScannerService.stopScanning();
      }
    };
  }, [isScanning]);

  const checkPermission = useCallback(async () => {
    try {
      const permission = await qrScannerService.checkCameraPermission();
      setHasPermission(permission);
      return permission;
    } catch (err) {
      setHasPermission(false);
      return false;
    }
  }, []);

  const startScanning = useCallback(async (
    elementId: string,
    onSuccess: (code: string) => void
  ) => {
    try {
      setError(null);
      setScannedCode(null);
      setIsScanning(true);

      await qrScannerService.startScanning(
        elementId,
        (decodedText) => {
          setScannedCode(decodedText);
          onSuccess(decodedText);
        },
        (error) => {
          setError(error);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start scanner');
      setIsScanning(false);
    }
  }, []);

  const stopScanning = useCallback(async () => {
    try {
      await qrScannerService.stopScanning();
      setIsScanning(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop scanner');
    }
  }, []);

  return {
    isScanning,
    scannedCode,
    error,
    hasPermission,
    startScanning,
    stopScanning,
    checkPermission
  };
}

