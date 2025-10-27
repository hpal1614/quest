// localStorage utilities for persisting user data

import { UserData, UserProgress, CompletedQuest } from '@/types/quest';
import { generateDeviceFingerprint } from '@/lib/pdf/generator';

const STORAGE_KEY = 'quest-sydney-user-data';
const ONBOARDING_KEY = 'quest-sydney-onboarding';

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

/**
 * Initialize user data if not exists
 */
export function initializeUserData(): UserData {
  let userData = getUserData();
  
  if (!userData) {
    userData = {
      userId: generateDeviceFingerprint(),
      deviceId: generateDeviceFingerprint(),
      onboardingCompleted: false,
      permissions: {
        gps: 'prompt',
        camera: 'prompt'
      },
      activeQuests: [],
      completedQuests: [],
      lastLocation: null
    };
    saveUserData(userData);
  }
  
  return userData;
}

/**
 * Update user location
 */
export function updateUserLocation(lat: number, lng: number): void {
  const userData = getUserData();
  if (!userData) return;
  
  userData.lastLocation = {
    lat,
    lng,
    timestamp: new Date().toISOString()
  };
  
  saveUserData(userData);
}

/**
 * Check if onboarding has been completed
 */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

/**
 * Mark onboarding as completed
 */
export function completeOnboarding(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_KEY, 'true');
  
  const userData = getUserData();
  if (userData) {
    userData.onboardingCompleted = true;
    saveUserData(userData);
  }
}

/**
 * Clear all user data (for testing/debugging)
 */
export function clearUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
}

