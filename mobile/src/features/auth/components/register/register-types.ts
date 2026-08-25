import { type FieldPath, type UseFormReturn } from "react-hook-form";
import {
  type PatientFormValues,
  type ProfessionalFormValues,
} from "@/features/auth/lib/auth-validation-schemas";

export type RegisterFormValues = PatientFormValues | ProfessionalFormValues;
export type RegisterFieldPath = Extract<
  FieldPath<PatientFormValues>,
  FieldPath<ProfessionalFormValues>
>;

export type AnyFormReturn =
  | UseFormReturn<PatientFormValues>
  | UseFormReturn<ProfessionalFormValues>;

export function asRegisterForm(
  form: AnyFormReturn,
): UseFormReturn<RegisterFormValues> {
  return form as unknown as UseFormReturn<RegisterFormValues>;
}
