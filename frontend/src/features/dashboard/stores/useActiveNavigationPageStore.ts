import { create } from "zustand";

export interface ActiveNavigationPageStore {
  activeNavigationPage: string;
  setActiveNavigationPage: (state: string) => void;
}

export const useActiveNavigationPageStore = create<ActiveNavigationPageStore>(
  (set) => ({
    activeNavigationPage: "Appointments Overview",
    setActiveNavigationPage: (state) => set({ activeNavigationPage: state }),
  }),
);
