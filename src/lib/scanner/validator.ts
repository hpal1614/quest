// QR Code Validator - Exact implementation from technical-architecture.md

import { Quest, Location, UserProgress, ValidationResult, Coordinates } from '@/types/quest';
import { isWithinRadius, calculateDistance } from '@/lib/gps/distance';

export function validateQRCode(
  scannedCode: string,
  quest: Quest,
  userProgress: UserProgress | undefined,
  userCoords: Coordinates
): ValidationResult {
  
  // Find location by QR code
  const location = quest.locations.find(l => l.qrCode === scannedCode);
  if (!location) {
    return {
      isValid: false,
      errorMessage: 'QR code not recognized. Make sure you\'re scanning an official Quest mascot.'
    };
  }

  // Check GPS proximity
  const distance = calculateDistance(userCoords, location.coordinates);
  if (!isWithinRadius(userCoords, location.coordinates, location.radius)) {
    return {
      isValid: false,
      errorMessage: `You're ${Math.round(distance)}m away. Move within ${location.radius}m to scan.`,
      distance,
      location
    };
  }

  // Check if quest has been started
  if (!userProgress?.questStarted && location.type !== 'start') {
    return {
      isValid: false,
      errorMessage: 'Scan the Start QR code first to begin this quest.'
    };
  }

  // Check sequence (for non-start locations)
  if (location.type !== 'start' && userProgress) {
    const currentIndex = quest.locations.findIndex(
      l => l.id === userProgress.currentLocationId
    );
    const scannedIndex = quest.locations.findIndex(l => l.id === location.id);
    
    // User should scan the next location in sequence
    if (scannedIndex !== currentIndex + 1) {
      // Find what they should scan next
      const nextLocation = quest.locations[currentIndex + 1];
      return {
        isValid: false,
        errorMessage: `You've jumped ahead! Complete "${nextLocation?.name}" first.`
      };
    }
  }

  // All checks passed
  return {
    isValid: true,
    location,
    distance
  };
}

/**
 * Parse QR code format: QSQ-{WEEK}-{LOCATION}-{ID}
 */
export function parseQRCode(code: string): {
  week: string | null;
  location: string | null;
  id: string | null;
  isValid: boolean;
} {
  const parts = code.split('-');
  
  if (parts.length !== 4 || parts[0] !== 'QSQ') {
    return { week: null, location: null, id: null, isValid: false };
  }

  return {
    week: parts[1],
    location: parts[2],
    id: parts[3],
    isValid: true
  };
}

