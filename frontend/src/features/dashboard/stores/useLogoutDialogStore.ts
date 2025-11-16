import { create } from "zustand";
import { type LogoutDialogStore } from "@/features/dashboard";

export const useLogoutDialogStore = create<LogoutDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (state) => set({ isOpen: state }),
}));
