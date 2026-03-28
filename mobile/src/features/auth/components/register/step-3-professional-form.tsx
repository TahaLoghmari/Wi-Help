import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGetSpecializations } from "@/api/professionals/get-specializations";
import { type ProfessionalFormValues } from "@/features/auth/lib/auth-validation-schemas";

interface Step3ProfessionalFormProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export function Step3ProfessionalForm({ form }: Step3ProfessionalFormProps) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = form;

  const { data: specializations } = useGetSpecializations();
  const specializationOptions = (specializations ?? []).map((s) => ({
    value: s.id,
    label: t(`lookups.${s.key}`),
  }));

  return (
    <>
      <Controller
        control={control}
        name="specializationId"
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("forms.labels.specialization")}
            options={specializationOptions}
            value={value}
            onValueChange={onChange}
            error={errors.specializationId?.message}
            placeholder={t("placeholders.specialization")}
            searchPlaceholder={t("placeholders.search")}
            accessibilityLabel={t("forms.labels.specialization")}
          />
        )}
      />
      <Controller
        control={control}
        name="experience"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("forms.labels.experience")}
            value={value === 0 ? "" : String(value)}
            onChangeText={(text) => onChange(text === "" ? 0 : Number(text))}
            onBlur={onBlur}
            error={errors.experience?.message}
            keyboardType="numeric"
            placeholder={t("placeholders.experience")}
            accessibilityLabel={t("forms.labels.experience")}
          />
        )}
      />
    </>
  );
}
