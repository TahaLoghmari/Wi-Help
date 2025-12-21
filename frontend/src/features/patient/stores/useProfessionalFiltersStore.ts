import { create } from "zustand";

interface ProfessionalFiltersState {
  search: string;
  location: string;
  maxPrice: number;
  availability: string;
  distanceFilterEnabled: boolean;
  maxDistanceKm: number;
  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setMaxPrice: (max: number) => void;
  setAvailability: (availability: string) => void;
  setDistanceFilterEnabled: (enabled: boolean) => void;
  setMaxDistanceKm: (km: number) => void;
  resetFilters: () => void;
}

export const useProfessionalFiltersStore = create<ProfessionalFiltersState>(
  (set) => ({
    search: "",
    location: "",
    maxPrice: 120,
    availability: "Any time",
    distanceFilterEnabled: false,
    maxDistanceKm: 50,
    setSearch: (search) => set({ search }),
    setLocation: (location) => set({ location }),
    setMaxPrice: (max) => set({ maxPrice: max }),
    setAvailability: (availability) => set({ availability }),
    setDistanceFilterEnabled: (enabled) =>
      set({ distanceFilterEnabled: enabled }),
    setMaxDistanceKm: (km) => set({ maxDistanceKm: km }),
    resetFilters: () =>
      set({
        search: "",
        location: "",
        maxPrice: 120,
        availability: "Any time",
        distanceFilterEnabled: false,
        maxDistanceKm: 50,
      }),
  }),
);
