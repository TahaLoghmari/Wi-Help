import React from "react";
import { View } from "react-native";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGetCountries } from "@/api/auth/get-countries";
import { useGetStatesByCountry } from "@/api/auth/get-states";
import { type AnyFormReturn } from "@/features/auth/types/api.types";

interface Step2FormProps {
  form: AnyFormReturn;
}

export function Step2Form({ form }: Step2FormProps) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = form as UseFormReturn<any>;
  const addrErr = (errors.address ?? {}) as Record<
    string,
    { message?: string }
  >;

  const { data: countries } = useGetCountries();
  const selectedCountryId = (useWatch({ control, name: "address.countryId" }) ??
    "") as string;
  const { data: states } = useGetStatesByCountry(selectedCountryId);

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.id,
    label: t(`lookups.${c.key}`),
  }));

  const stateOptions = (states ?? []).map((s) => ({
    value: s.id,
    label: t(`lookups.${s.key}`),
  }));

  return (
    <>
      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("forms.labels.streetAddress")}
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            error={addrErr.street?.message}
            placeholder={t("placeholders.streetAddress")}
            accessibilityLabel={t("forms.labels.streetAddress")}
          />
        )}
      />
      {/* City + postal code — side by side */}
      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="address.city"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("forms.labels.city")}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={addrErr.city?.message}
                placeholder={t("placeholders.city")}
                accessibilityLabel={t("forms.labels.city")}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="address.postalCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("forms.labels.postalCode")}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={addrErr.postalCode?.message}
                keyboardType="numeric"
                placeholder={t("placeholders.postalCode")}
                accessibilityLabel={t("forms.labels.postalCode")}
              />
            )}
          />
        </View>
      </View>
      <Controller
        control={control}
        name="address.countryId"
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("forms.labels.country")}
            options={countryOptions}
            value={value as string}
            onValueChange={(v) => {
              onChange(v);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (form as unknown as UseFormReturn<Record<string, any>>).setValue(
                "address.stateId",
                "",
              );
            }}
            error={addrErr.countryId?.message}
            placeholder={t("placeholders.country")}
            searchPlaceholder={t("placeholders.search")}
            accessibilityLabel={t("forms.labels.country")}
          />
        )}
      />
      <Controller
        control={control}
        name="address.stateId"
        render={({ field: { onChange, value } }) => (
          <Select
            label={t("forms.labels.state")}
            options={stateOptions}
            value={value as string}
            onValueChange={onChange}
            error={addrErr.stateId?.message}
            placeholder={t("placeholders.state")}
            searchPlaceholder={t("placeholders.search")}
            accessibilityLabel={t("forms.labels.state")}
            disabled={!selectedCountryId}
          />
        )}
      />
    </>
  );
}
