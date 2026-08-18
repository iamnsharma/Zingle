import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OnboardingData } from '@types';

interface OnboardingStoreState {
  data: OnboardingData;
  currentStep: number;
  isCompleted: boolean;
  updateData: (newData: Partial<OnboardingData>) => void;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialOnboardingData: OnboardingData = {};

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    set => ({
      data: initialOnboardingData,
      currentStep: 1,
      isCompleted: false,

      updateData: newData =>
        set(state => ({
          data: { ...state.data, ...newData },
        })),

      setCurrentStep: step => set({ currentStep: step }),

      completeOnboarding: () => set({ isCompleted: true }),

      resetOnboarding: () =>
        set({
          data: initialOnboardingData,
          currentStep: 1,
          isCompleted: false,
        }),
    }),
    {
      name: 'zingle-onboarding-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
