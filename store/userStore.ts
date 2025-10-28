// User Store for preferences and permissions

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  onboardingCompleted: boolean;
  permissions: {
    gps: PermissionState;
    camera: PermissionState;
  };
  deviceId: string | null;
  
  // Actions
  completeOnboarding: () => void;
  setGPSPermission: (state: PermissionState) => void;
  setCameraPermission: (state: PermissionState) => void;
  setDeviceId: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      permissions: {
        gps: 'prompt',
        camera: 'prompt'
      },
      deviceId: null,
      
      completeOnboarding: () => {
        set({ onboardingCompleted: true });
      },
      
      setGPSPermission: (state: PermissionState) => {
        set((prev) => ({
          permissions: {
            ...prev.permissions,
            gps: state
          }
        }));
      },
      
      setCameraPermission: (state: PermissionState) => {
        set((prev) => ({
          permissions: {
            ...prev.permissions,
            camera: state
          }
        }));
      },
      
      setDeviceId: (id: string) => {
        set({ deviceId: id });
      }
    }),
    {
      name: 'user-storage'
    }
  )
);


