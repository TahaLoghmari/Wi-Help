import { create } from "zustand";

export interface StepsStore {
  step: number;
  setStep: (state: number) => void;
}

export const useStepsStore = create<StepsStore>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),
}));
