import { create } from "zustand";
import { type DashboardSidebarStateStore } from "@/features/dashboard";

export const useDashboardSidebarStateStore = create<DashboardSidebarStateStore>(
  (set) => ({
    isSidebarOpen: true,
    setIsSidebarOpen: (state) => set({ isSidebarOpen: state }),
  }),
);
