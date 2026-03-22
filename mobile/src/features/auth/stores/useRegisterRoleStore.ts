import { create } from "zustand";

export type RegisterRole = "patient" | "professional";

export interface RegisterRoleStore {
  registerRole: RegisterRole;
  setRegisterRole: (role: RegisterRole) => void;
}

export const useRegisterRoleStore = create<RegisterRoleStore>((set) => ({
  registerRole: "patient",
  setRegisterRole: (role) => set({ registerRole: role }),
}));
