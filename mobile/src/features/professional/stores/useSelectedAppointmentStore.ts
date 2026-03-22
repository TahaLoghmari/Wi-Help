import { create } from "zustand";
import { type AppointmentDto } from "@/features/professional/types/api.types";

interface SelectedAppointmentStore {
  appointment: AppointmentDto | null;
  setAppointment: (appointment: AppointmentDto) => void;
  clear: () => void;
}

export const useSelectedAppointmentStore = create<SelectedAppointmentStore>(
  (set) => ({
    appointment: null,
    setAppointment: (appointment) => set({ appointment }),
    clear: () => set({ appointment: null }),
  }),
);
