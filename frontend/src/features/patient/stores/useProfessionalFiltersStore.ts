import { create } from "zustand";

interface ProfessionalFiltersState {
  search: string;
  location: string;
  maxPrice: number;
  availability: string;
  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setMaxPrice: (max: number) => void;
  setAvailability: (availability: string) => void;
  resetFilters: () => void;
}

export const useProfessionalFiltersStore = create<ProfessionalFiltersState>(
  (set) => ({
    search: "",
    location: "",
    maxPrice: 120,
    availability: "Any time",
    setSearch: (search) => set({ search }),
    setLocation: (location) => set({ location }),
    setMaxPrice: (max) => set({ maxPrice: max }),
    setAvailability: (availability) => set({ availability }),
    resetFilters: () =>
      set({
        search: "",
        location: "",
        maxPrice: 120,
        availability: "Any time",
      }),
  }),
);
