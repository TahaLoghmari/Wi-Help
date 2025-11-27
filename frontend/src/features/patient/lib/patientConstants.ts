export interface SelectItem {
  value: string;
  label: string;
}

export const ALLERGIES: SelectItem[] = [
  { value: "peanuts", label: "Peanuts" },
  { value: "tree_nuts", label: "Tree Nuts" },
  { value: "milk", label: "Milk" },
  { value: "egg", label: "Egg" },
  { value: "wheat", label: "Wheat" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
  { value: "penicillin", label: "Penicillin" },
  { value: "latex", label: "Latex" },
  { value: "pollen", label: "Pollen" },
  { value: "dust_mites", label: "Dust Mites" },
  { value: "pet_dander", label: "Pet Dander" },
  { value: "insect_stings", label: "Insect Stings" },
];

export const CHRONIC_CONDITIONS: SelectItem[] = [
  { value: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { value: "diabetes_type_1", label: "Diabetes Type 1" },
  { value: "diabetes_type_2", label: "Diabetes Type 2" },
  { value: "asthma", label: "Asthma" },
  { value: "arthritis", label: "Arthritis" },
  { value: "heart_disease", label: "Heart Disease" },
  { value: "copd", label: "COPD (Chronic Obstructive Pulmonary Disease)" },
  { value: "depression", label: "Depression" },
  { value: "anxiety", label: "Anxiety" },
  { value: "obesity", label: "Obesity" },
  { value: "osteoporosis", label: "Osteoporosis" },
  { value: "chronic_kidney_disease", label: "Chronic Kidney Disease" },
  { value: "alzheimers", label: "Alzheimer's Disease" },
  { value: "cancer", label: "Cancer" },
  { value: "stroke", label: "Stroke" },
];

export const MEDICATIONS: SelectItem[] = [
  { value: "lisinopril", label: "Lisinopril" },
  { value: "levothyroxine", label: "Levothyroxine" },
  { value: "atorvastatin", label: "Atorvastatin" },
  { value: "metformin", label: "Metformin" },
  { value: "simvastatin", label: "Simvastatin" },
  { value: "omeprazole", label: "Omeprazole" },
  { value: "amlodipine", label: "Amlodipine" },
  { value: "metoprolol", label: "Metoprolol" },
  { value: "albuterol", label: "Albuterol" },
  { value: "gabapentin", label: "Gabapentin" },
  { value: "hydrochlorothiazide", label: "Hydrochlorothiazide" },
  { value: "losartan", label: "Losartan" },
  { value: "sertraline", label: "Sertraline" },
  { value: "furosemide", label: "Furosemide" },
  { value: "pantoprazole", label: "Pantoprazole" },
];

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
