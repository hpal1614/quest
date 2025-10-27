// useQuestProgress Hook - Exact implementation from technical-architecture.md

'use client';

import { useQuestStore } from '@/store/questStore';
import { Quest, Location } from '@/types/quest';

export function useQuestProgress(quest: Quest) {
  const { 
    activeQuests, 
    updateProgress, 
    addHint, 
    completeQuest,
    getQuestProgress 
  } = useQuestStore();
  
  const progress = getQuestProgress(quest.id);
  
  const currentLocation = progress 
    ? quest.locations.find((loc) => loc.id === progress.currentLocationId)
    : null;
  
  const completionPercentage = progress
    ? (progress.completedLocationIds.length / quest.locations.length) * 100
    : 0;
  
  const hintsUsedAtLocation = (locationId: string) =>
    progress?.hintsUsed[locationId] || 0;
  
  const totalHintsUsed = progress
    ? Object.values(progress.hintsUsed).reduce((a, b) => a + b, 0)
    : 0;
  
  const nextLocation = (): Location | null => {
    if (!progress) return quest.locations[0]; // Return start location
    
    const currentIndex = quest.locations.findIndex(
      (loc) => loc.id === progress.currentLocationId
    );
    
    if (currentIndex === -1 || currentIndex === quest.locations.length - 1) {
      return null; // No next location (quest complete)
    }
    
    return quest.locations[currentIndex + 1];
  };
  
  return {
    progress,
    currentLocation,
    nextLocation: nextLocation(),
    completionPercentage,
    hintsUsedAtLocation,
    totalHintsUsed,
    updateProgress,
    addHint,
    completeQuest
  };
}

