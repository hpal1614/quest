// useGeolocation Hook - HARDCODED TO HAYMARKET FOR TESTING

'use client';

import { useState, useEffect } from 'react';
import { Coordinates } from '@/types/quest';

export function useGeolocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real GPS location enabled
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      setLoading(false);
      return;
    }

    console.log('🗺️ Requesting real GPS location...');

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
        setLoading(false);
        console.log('📍 GPS Location:', position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error('GPS Error:', err);
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, loading };
}

