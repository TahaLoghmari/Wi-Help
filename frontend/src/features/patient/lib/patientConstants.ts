export interface SelectItem {
  value: string;
  label: string;
}

export const ALLERGIES_EN: SelectItem[] = [
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

export const ALLERGIES_FR: SelectItem[] = [
  { value: "peanuts", label: "Arachides" },
  { value: "tree_nuts", label: "Fruits à coque" },
  { value: "milk", label: "Lait" },
  { value: "egg", label: "Œuf" },
  { value: "wheat", label: "Blé" },
  { value: "soy", label: "Soja" },
  { value: "fish", label: "Poisson" },
  { value: "shellfish", label: "Crustacés" },
  { value: "sesame", label: "Sésame" },
  { value: "penicillin", label: "Pénicilline" },
  { value: "latex", label: "Latex" },
  { value: "pollen", label: "Pollen" },
  { value: "dust_mites", label: "Acariens" },
  { value: "pet_dander", label: "Pellicules d'animaux" },
  { value: "insect_stings", label: "Piqûres d'insectes" },
];

export const CHRONIC_CONDITIONS_EN: SelectItem[] = [
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

export const CHRONIC_CONDITIONS_FR: SelectItem[] = [
  { value: "hypertension", label: "Hypertension (Haute pression sanguine)" },
  { value: "diabetes_type_1", label: "Diabète de type 1" },
  { value: "diabetes_type_2", label: "Diabète de type 2" },
  { value: "asthma", label: "Asthme" },
  { value: "arthritis", label: "Arthrite" },
  { value: "heart_disease", label: "Maladie cardiaque" },
  { value: "copd", label: "BPCO (Bronchopneumopathie chronique obstructive)" },
  { value: "depression", label: "Dépression" },
  { value: "anxiety", label: "Anxiété" },
  { value: "obesity", label: "Obésité" },
  { value: "osteoporosis", label: "Ostéoporose" },
  { value: "chronic_kidney_disease", label: "Maladie rénale chronique" },
  { value: "alzheimers", label: "Maladie d'Alzheimer" },
  { value: "cancer", label: "Cancer" },
  { value: "stroke", label: "AVC (Accident vasculaire cérébral)" },
];

export const MEDICATIONS_EN: SelectItem[] = [
  { value: "lisinopril", label: "Lisinopril" },
  { value: "levothyroxine", label: "Levothyroxine" },
  { value: "atorvastatin", label: "Atorvastatin" },
  { value: "metformin", label: "Metformin" },
  { value: "simvastatin", label: "Simvastatin" },
  { value: "omeprazole", label: "Omeprazole" },
  { value: "amlodipine", label: "Amlodipine" },
  { value: "metoprolol", label: "Metoprolol" },
];

export const MEDICATIONS_FR: SelectItem[] = [
  { value: "lisinopril", label: "Lisinopril" },
  { value: "levothyroxine", label: "Lévothyroxine" },
  { value: "atorvastatin", label: "Atorvastatine" },
  { value: "metformin", label: "Metformine" },
  { value: "simvastatin", label: "Simvastatine" },
  { value: "omeprazole", label: "Oméprazole" },
  { value: "amlodipine", label: "Amlodipine" },
  { value: "metoprolol", label: "Métoprolol" },
];

export const getAllergies = (lang: string) =>
  lang === "fr" ? ALLERGIES_FR : ALLERGIES_EN;

export const getChronicConditions = (lang: string) =>
  lang === "fr" ? CHRONIC_CONDITIONS_FR : CHRONIC_CONDITIONS_EN;

export const getMedications = (lang: string) =>
  lang === "fr" ? MEDICATIONS_FR : MEDICATIONS_EN;

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
