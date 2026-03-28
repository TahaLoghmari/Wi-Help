import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGetRelationships } from "@/api/patients/get-relationships";
import { type PatientFormValues } from "@/features/auth/lib/auth-validation-schemas";

interface Step3PatientFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function Step3PatientForm({ form }: Step3PatientFormProps) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = form;

  const { data: relationships } = useGetRelationships();
  const relationshipOptions = (relationships ?? []).map((r) => ({
    value: r.id,
    label: t(`lookups.${r.key}`),
  }));

  return (
    <>
      <Controller
        control={control}
        name="emergencyContact.fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("forms.labels.emergencyContactName")}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.emergencyContact?.fullName?.message}
            placeholder={t("placeholders.emergencyContactName")}
            accessibilityLabel={t("forms.labels.emergencyContactName")}
          />
        )}
      />
      <Controller
        control={control}
        name="emergencyContact.phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("forms.labels.phoneNumber")}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.emergencyContact?.phoneNumber?.message}
            keyboardType="phone-pad"
            placeholder={t("placeholders.phoneNumber")}
            accessibilityLabel={t("forms.labels.phoneNumber")}
          />
        )}
      />
      <Controller
        control={control}
        name="emergencyContact.relationshipId"
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("forms.labels.relationship")}
            options={relationshipOptions}
            value={value}
            onValueChange={onChange}
            error={errors.emergencyContact?.relationshipId?.message}
            placeholder={t("placeholders.relationship")}
            searchPlaceholder={t("placeholders.search")}
            accessibilityLabel={t("forms.labels.relationship")}
          />
        )}
      />
    </>
  );
}
