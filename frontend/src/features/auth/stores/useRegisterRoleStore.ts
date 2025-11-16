import { create } from "zustand";

export type RegisterRole = "patient" | "professional";

export interface RegisterRoleStore {
  registerRole: RegisterRole;
  setRegisterRole: (state: RegisterRole) => void;
}

export const useRegisterRoleStore = create<RegisterRoleStore>((set) => ({
  registerRole: "patient",
  setRegisterRole: (value) => set({ registerRole: value }),
}));
