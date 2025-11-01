import { create } from "zustand";

export interface RegisterRoleStore {
  registerRole: string;
  setRegisterRole: (state: string) => void;
}

export const useRegisterRoleStore = create<RegisterRoleStore>((set) => ({
  registerRole: "patient",
  setRegisterRole: (value) => set({ registerRole: value }),
}));
