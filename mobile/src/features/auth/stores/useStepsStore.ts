import { create } from "zustand";

export interface StepsStore {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useStepsStore = create<StepsStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
}));
