import { create } from "zustand";

interface DashboardSidebarStateStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}

export const useDashboardSidebarStateStore = create<DashboardSidebarStateStore>(
  (set) => ({
    isSidebarOpen: true,
    setIsSidebarOpen: (state) => set({ isSidebarOpen: state }),
  }),
);
