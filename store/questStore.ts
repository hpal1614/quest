// Quest Store - Exact implementation from technical-architecture.md

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, CompletedQuest, Coordinates } from '@/types/quest';

interface QuestState {
  activeQuests: UserProgress[];
  completedQuests: CompletedQuest[];
  currentLocation: Coordinates | null;
  
  // Actions
  startQuest: (questId: string) => void;
  updateProgress: (questId: string, locationId: string) => void;
  addHint: (questId: string, locationId: string) => void;
  completeQuest: (questId: string, voucherCode: string, voucherPdfUrl?: string) => void;
  setCurrentLocation: (location: Coordinates) => void;
  getQuestProgress: (questId: string) => UserProgress | undefined;
  hasCompletedQuest: (questId: string) => boolean;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuests: [],
      completedQuests: [],
      currentLocation: null,
      
      startQuest: (questId: string) => {
        const existing = get().activeQuests.find(q => q.questId === questId);
        if (existing) return; // Already started
        
        set((state) => ({
          activeQuests: [
            ...state.activeQuests,
            {
              questId,
              status: 'in_progress',
              startedAt: new Date().toISOString(),
              currentLocationId: 'start',
              completedLocationIds: [],
              hintsUsed: {},
              questStarted: true
            }
          ]
        }));
      },
      
      updateProgress: (questId: string, locationId: string) => {
        set((state) => ({
          activeQuests: state.activeQuests.map((q) =>
            q.questId === questId
              ? {
                  ...q,
                  currentLocationId: locationId,
                  completedLocationIds: [...q.completedLocationIds, q.currentLocationId]
                }
              : q
          )
        }));
      },
      
      addHint: (questId: string, locationId: string) => {
        set((state) => ({
          activeQuests: state.activeQuests.map((q) =>
            q.questId === questId
              ? {
                  ...q,
                  hintsUsed: {
                    ...q.hintsUsed,
                    [locationId]: (q.hintsUsed[locationId] || 0) + 1
                  }
                }
              : q
          )
        }));
      },
      
      completeQuest: (questId: string, voucherCode: string, voucherPdfUrl?: string) => {
        const quest = get().activeQuests.find((q) => q.questId === questId);
        if (!quest) return;
        
        const totalHints = Object.values(quest.hintsUsed).reduce((a, b) => a + b, 0);
        const duration = Math.floor(
          (new Date().getTime() - new Date(quest.startedAt).getTime()) / 60000
        );
        
        set((state) => ({
          activeQuests: state.activeQuests.filter((q) => q.questId !== questId),
          completedQuests: [
            ...state.completedQuests,
            {
              questId,
              completedAt: new Date().toISOString(),
              duration,
              totalHintsUsed: totalHints,
              voucherCode,
              voucherPdfUrl
            }
          ]
        }));
      },
      
      setCurrentLocation: (location: Coordinates) => {
        set({ currentLocation: location });
      },
      
      getQuestProgress: (questId: string) => {
        return get().activeQuests.find((q) => q.questId === questId);
      },
      
      hasCompletedQuest: (questId: string) => {
        return get().completedQuests.some((q) => q.questId === questId);
      }
    }),
    {
      name: 'quest-storage'
    }
  )
);


