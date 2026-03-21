// Allergy, condition, and medication constants migrated to database-backed lookup tables.
// Use GetAllergies, GetConditions, GetMedications from @/features/patient instead.

export interface SelectItem {
  value: string;
  label: string;
}

export const MOBILITY_STATUSES: SelectItem[] = [
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "Limited",
    label: "Limited",
  },
  {
    value: "Immobile",
    label: "Immobile",
  },
];
