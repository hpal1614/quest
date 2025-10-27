// Distance Calculator - Exact implementation from technical-architecture.md

import { Coordinates } from '@/types/quest';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = coord1.lat * Math.PI/180;
  const φ2 = coord2.lat * Math.PI/180;
  const Δφ = (coord2.lat - coord1.lat) * Math.PI/180;
  const Δλ = (coord2.lng - coord1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // meters
}

/**
 * Check if user coordinates are within specified radius of target
 */
export function isWithinRadius(
  userCoords: Coordinates,
  targetCoords: Coordinates,
  radius: number
): boolean {
  return calculateDistance(userCoords, targetCoords) <= radius;
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
}

/**
 * Get distance category for quest card display
 */
export function getDistanceCategory(distance: number): 'available' | 'nearby' | 'far' {
  if (distance <= 50) return 'available';
  if (distance <= 2000) return 'nearby';
  return 'far';
}

