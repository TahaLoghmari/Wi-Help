import { create } from "zustand";

interface LogoutDialogStore {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export const useLogoutDialogStore = create<LogoutDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (state) => set({ isOpen: state }),
}));
