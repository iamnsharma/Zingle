import { create } from 'zustand';
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

export const useOnboardingStore = create<OnboardingStoreState>((set) => ({
  data: initialOnboardingData,
  currentStep: 1,
  isCompleted: false,

  updateData: (newData: Partial<OnboardingData>) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),

  setCurrentStep: (step: number) =>
    set({
      currentStep: step,
    }),

  completeOnboarding: () =>
    set({
      isCompleted: true,
    }),

  resetOnboarding: () =>
    set({
      data: initialOnboardingData,
      currentStep: 1,
      isCompleted: false,
    }),
}));
