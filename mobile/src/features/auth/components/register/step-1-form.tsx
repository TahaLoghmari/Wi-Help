import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { type AnyFormReturn } from "./register-types";

interface Step1FormProps {
  form: AnyFormReturn;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
}

export function Step1Form({
  form,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: Step1FormProps) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = form as UseFormReturn<any>;

  return (
    <>
      {/* First & last name — side by side */}
      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("forms.labels.firstName")}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message as string | undefined}
                placeholder={t("placeholders.firstName")}
                accessibilityLabel={t("forms.labels.firstName")}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("forms.labels.lastName")}
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message as string | undefined}
                placeholder={t("placeholders.lastName")}
                accessibilityLabel={t("forms.labels.lastName")}
              />
            )}
          />
        </View>
      </View>

      {/* Email */}
      <View className="gap-y-1.5">
        <Text className="text-base font-medium text-brand-dark">
          {t("common.email")}
        </Text>
        <View className="relative">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message as string | undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder={t("placeholders.email")}
                accessibilityLabel={t("common.email")}
                className="pl-11"
              />
            )}
          />
          <View className="absolute left-3.5 top-3.5" pointerEvents="none">
            <Ionicons name="mail-outline" size={20} color="#9ca3af" />
          </View>
        </View>
      </View>

      {/* Password */}
      <View className="gap-y-1.5">
        <Text className="text-base font-medium text-brand-dark">
          {t("forms.labels.password")}
        </Text>
        <View className="relative">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message as string | undefined}
                secureTextEntry={!showPassword}
                placeholder={t("placeholders.createPassword")}
                accessibilityLabel={t("forms.labels.password")}
                className="pl-11 pr-11"
              />
            )}
          />
          <View className="absolute left-3.5 top-3.5" pointerEvents="none">
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
          </View>
          <Pressable
            className="absolute right-3.5 top-3.5"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9ca3af"
            />
          </Pressable>
        </View>
      </View>

      {/* Confirm password */}
      <View className="gap-y-1.5">
        <Text className="text-base font-medium text-brand-dark">
          {t("forms.labels.confirmPassword")}
        </Text>
        <View className="relative">
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message as string | undefined}
                secureTextEntry={!showConfirmPassword}
                placeholder={t("placeholders.confirmPassword")}
                accessibilityLabel={t("forms.labels.confirmPassword")}
                className="pl-11 pr-11"
              />
            )}
          />
          <View className="absolute left-3.5 top-3.5" pointerEvents="none">
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
          </View>
          <Pressable
            className="absolute right-3.5 top-3.5"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            accessibilityLabel={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9ca3af"
            />
          </Pressable>
        </View>
      </View>

      {/* Gender */}
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="mb-1.5 text-base font-medium text-brand-dark">
              {t("forms.labels.gender")}
            </Text>
            <View className="flex-row gap-x-3">
              {(["Male", "Female"] as const).map((g) => (
                <Pressable
                  key={g}
                  className={cn(
                    "flex-1 items-center rounded-xl border py-3",
                    value === g
                      ? "border-brand-dark bg-brand-dark"
                      : "border-gray-200 bg-white",
                  )}
                  onPress={() => onChange(g)}
                  accessibilityLabel={
                    g === "Male" ? t("common.male") : t("common.female")
                  }
                  accessibilityRole="button"
                >
                  <Text
                    className={cn(
                      "text-sm font-medium",
                      value === g ? "text-white" : "text-brand-dark",
                    )}
                  >
                    {g === "Male" ? t("common.male") : t("common.female")}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.gender?.message ? (
              <Text className="mt-1 text-sm text-red-500">
                {errors.gender.message as string}
              </Text>
            ) : null}
          </View>
        )}
      />

      {/* Date of birth */}
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <DateInput
            label={t("forms.labels.dateOfBirth")}
            value={value as string}
            onChange={onChange}
            error={errors.dateOfBirth?.message as string | undefined}
          />
        )}
      />

      {/* Phone number */}
      <View className="gap-y-1.5">
        <Text className="text-base font-medium text-brand-dark">
          {t("forms.labels.phoneNumber")}
        </Text>
        <View className="relative">
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value as string}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phoneNumber?.message as string | undefined}
                keyboardType="phone-pad"
                placeholder={t("placeholders.phoneNumber")}
                accessibilityLabel={t("forms.labels.phoneNumber")}
                className="pl-11"
              />
            )}
          />
          <View className="absolute left-3.5 top-3.5" pointerEvents="none">
            <Ionicons name="call-outline" size={20} color="#9ca3af" />
          </View>
        </View>
      </View>
    </>
  );
}
