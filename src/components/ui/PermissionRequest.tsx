// Permission Request Component

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';

interface PermissionRequestProps {
  onGranted: () => void;
  onDenied: () => void;
}

export function PermissionRequest({ onGranted, onDenied }: PermissionRequestProps) {
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setGPSPermission, setCameraPermission } = useUserStore();

  const requestPermissions = async () => {
    setRequesting(true);
    setError(null);

    try {
      // Request GPS permission with longer timeout
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            // Check the actual error type
            if (error.code === error.PERMISSION_DENIED) {
              reject(new Error('PERMISSION_DENIED'));
            } else if (error.code === error.TIMEOUT) {
              reject(new Error('TIMEOUT'));
            } else {
              reject(new Error('POSITION_UNAVAILABLE'));
            }
          }, 
          {
            enableHighAccuracy: false, // Changed to false for faster response
            timeout: 30000, // Increased to 30 seconds
            maximumAge: 10000 // Allow cached position
          }
        );
      });

      setGPSPermission('granted');

      // GPS granted, now we can proceed
      // Camera permission will be requested when scanning
      onGranted();
    } catch (err: any) {
      console.error('GPS Error:', err);
      
      if (err.message === 'PERMISSION_DENIED') {
        setError('Location access is required to play. Please enable location in your browser settings.');
        setGPSPermission('denied');
      } else if (err.message === 'TIMEOUT') {
        setError('Location request timed out. Please make sure you\'re outdoors or near a window and try again.');
        setGPSPermission('prompt');
      } else {
        setError('Unable to get your location. Please make sure location services are enabled and try again.');
        setGPSPermission('prompt');
      }
      
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Icon */}
        <div className="text-6xl text-center mb-6">
          📍
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Enable Location
        </h2>

        {/* Description */}
        <div className="space-y-3 text-gray-700 mb-6">
          <p className="text-center">
            We need your location to:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Show nearby quests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Verify you&apos;re at challenge locations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Calculate distances to quest points</span>
            </li>
          </ul>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-900">
            🔒 <strong>Privacy:</strong> We only use GPS for quest validation. 
            No tracking, no sharing, stored locally on your device only.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={requestPermissions}
            disabled={requesting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {requesting ? 'Requesting...' : 'Allow Location'}
          </button>

          <button
            onClick={() => {
              setGPSPermission('prompt');
              onGranted(); // Allow them to proceed anyway
            }}
            className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
          >
            Skip for now (can enable later)
          </button>
        </div>

        {/* Help Link */}
        <div className="text-center mt-6">
          <button className="text-xs text-purple-600 hover:text-purple-700">
            Having trouble? Learn more →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

