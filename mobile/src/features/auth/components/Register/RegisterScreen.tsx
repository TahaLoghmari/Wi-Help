import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Controller,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { DateInput } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useRegisterPatient } from "@/features/auth/hooks/useRegisterPatient";
import { useRegisterProfessional } from "@/features/auth/hooks/useRegisterProfessional";
import {
  patientSchema,
  professionalSchema,
  type PatientFormValues,
  type ProfessionalFormValues,
} from "@/features/auth/lib/authValidationSchemas";
import {
  PatientFormDefaults,
  ProfessionalFormDefaults,
} from "@/features/auth/lib/authFormDefaults";
import {
  useRegisterRoleStore,
  type RegisterRole,
} from "@/features/auth/stores/useRegisterRoleStore";
import { useStepsStore } from "@/features/auth/stores/useStepsStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { cn } from "@/lib/utils";
import { useGetCountries } from "@/features/auth/hooks/useGetCountries";
import { useGetStatesByCountry } from "@/features/auth/hooks/useGetStatesByCountry";
import { useGetSpecializations } from "@/features/professional/hooks/GetSpecializations";
import { useGetRelationships } from "@/features/patient/hooks/GetRelationships";

const TOTAL_STEPS = 3;

function getProgressValue(step: number): number {
  if (step === 1) return 0;
  if (step === 2) return 50;
  return 100;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;
type AnyFormReturn =
  | UseFormReturn<PatientFormValues>
  | UseFormReturn<ProfessionalFormValues>;

// ── RegisterScreen ────────────────────────────────────────────────────────────

export function RegisterScreen() {
  const { t } = useTranslation();
  const { goToLogin, goBack } = useAppNavigation();
  const { registerRole, setRegisterRole } = useRegisterRoleStore();
  const { step, nextStep, prevStep, setStep } = useStepsStore();

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  const registerPatient = useRegisterPatient();
  const registerProfessional = useRegisterProfessional();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPatient = registerRole === "patient";

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: PatientFormDefaults(),
  });

  const professionalForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    mode: "onChange",
    defaultValues: ProfessionalFormDefaults(),
  });

  const handleRoleSwitcher = (role: RegisterRole) => {
    if (role === registerRole) return;
    setRegisterRole(role);
    setStep(1);
    patientForm.reset(PatientFormDefaults());
    professionalForm.reset(ProfessionalFormDefaults());
  };

  const stepLabels = isPatient
    ? [
        t("auth.steps.personalInfo"),
        t("auth.steps.addressInfo"),
        t("auth.steps.emergencyContact"),
      ]
    : [
        t("auth.steps.personalInfo"),
        t("auth.steps.addressInfo"),
        t("auth.steps.professionalInfo"),
      ];

  const step1Fields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "confirmPassword",
    "gender",
    "dateOfBirth",
    "phoneNumber",
  ];

  const step2Fields = [
    "address.street",
    "address.city",
    "address.postalCode",
    "address.countryId",
    "address.stateId",
  ];

  const handleNext = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeForm = (
      isPatient ? patientForm : professionalForm
    ) as UseFormReturn<any>;
    const fields = step === 1 ? step1Fields : step2Fields;
    const isValid = await activeForm.trigger(fields);
    if (isValid) nextStep();
  };

  const handleSubmit = () => {
    if (isPatient) {
      patientForm.handleSubmit((data) => {
        registerPatient.mutate({ ...data, role: "patient" });
      })();
    } else {
      professionalForm.handleSubmit((data) => {
        registerProfessional.mutate(data);
      })();
    }
  };

  const isSubmitting =
    registerPatient.isPending || registerProfessional.isPending;

  return (
    <KeyboardAvoidingView className="flex-1 bg-brand-bg" behavior="padding">
      <ScrollView
        contentContainerClassName="flex-grow"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable
          className="ml-6 mt-14 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          onPress={goBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#00394a" />
        </Pressable>

        <View className="px-6 pb-10 pt-6">
          {/* Logo & branding */}
          <View className="mb-8">
            <View className="mb-6 flex-row items-center gap-x-2.5">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <Image
                  source={require("@/assets/images/icon-2.png")}
                  className="h-8 w-8"
                  resizeMode="contain"
                  accessibilityLabel="Wi Help logo"
                />
              </View>
              <Text className="text-xl font-semibold tracking-tight text-brand-dark">
                Wi-Help
              </Text>
            </View>
            <Text className="text-3xl font-semibold tracking-tight text-brand-dark">
              {t("auth.createAccount")}
            </Text>
            <Text className="mt-3 text-base text-brand-secondary opacity-80">
              {t("auth.registerDescription")}
            </Text>
          </View>

          {/* Role switcher */}
          <View className="mb-6 flex-row rounded-2xl bg-gray-100 p-1">
            {(["patient", "professional"] as RegisterRole[]).map((role) => (
              <Pressable
                key={role}
                className={cn(
                  "flex-1 items-center rounded-xl py-2.5",
                  registerRole === role
                    ? "bg-white shadow-sm"
                    : "bg-transparent shadow-transparent",
                )}
                onPress={() => handleRoleSwitcher(role)}
                accessibilityLabel={t(`auth.roles.${role}`)}
                accessibilityRole="button"
              >
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    registerRole === role ? "text-brand-dark" : "text-gray-400",
                  )}
                >
                  {t(`auth.roles.${role}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Progress */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-brand-secondary">
              {t("auth.stepOf", { step, total: TOTAL_STEPS })}
            </Text>
            <ProgressBar value={getProgressValue(step)} />
            <View className="mt-2 flex-row justify-between">
              {stepLabels.map((label, idx) => (
                <Text
                  key={label}
                  className={cn(
                    "text-xs",
                    idx + 1 <= step
                      ? "font-medium text-brand-dark"
                      : "text-gray-400",
                  )}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>

          {/* Step content */}
          <View className="gap-y-5">
            {step === 1 && (
              <Step1Form
                form={isPatient ? patientForm : professionalForm}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                t={t}
              />
            )}
            {step === 2 && (
              <Step2Form
                form={isPatient ? patientForm : professionalForm}
                t={t}
              />
            )}
            {step === 3 && isPatient && (
              <Step3PatientForm form={patientForm} t={t} />
            )}
            {step === 3 && !isPatient && (
              <Step3ProfessionalForm form={professionalForm} t={t} />
            )}
          </View>

          {/* Navigation buttons */}
          <View className="mt-6 flex-row gap-x-3">
            {step > 1 && (
              <Button
                variant="outline"
                onPress={prevStep}
                className="w-24"
                accessibilityLabel={t("common.back")}
              >
                {t("common.back")}
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button
                onPress={handleNext}
                className="flex-1"
                accessibilityLabel={t("common.continue")}
              >
                {t("common.continue")}
              </Button>
            ) : (
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                className="flex-1"
                accessibilityLabel={t("common.register")}
              >
                {t("common.register")}
              </Button>
            )}
          </View>

          {/* Google sign up — step 1 only */}
          {step === 1 && (
            <>
              <View className="my-8 flex-row items-center gap-x-4">
                <View className="flex-1 border-t border-gray-100" />
                <Text className="text-base text-gray-400">
                  {t("auth.orContinueWith")}
                </Text>
                <View className="flex-1 border-t border-gray-100" />
              </View>
              <Pressable
                className="flex-row items-center justify-center gap-x-2.5 rounded-xl border border-gray-200 bg-white py-3 active:bg-gray-50"
                onPress={() => {}}
                accessibilityLabel="Sign up with Google"
                accessibilityRole="button"
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text className="text-base font-medium text-brand-dark">
                  Google
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Already have account */}
        <View className="flex-row items-center justify-center pb-8">
          <Text className="text-base text-brand-secondary">
            {t("auth.alreadyHaveAccount")}{" "}
          </Text>
          <Pressable
            onPress={goToLogin}
            accessibilityLabel={t("auth.signIn")}
            accessibilityRole="button"
          >
            <Text className="text-base font-medium text-brand-teal">
              {t("auth.signIn")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Step sub-components ──────────────────────────────────────────────────────

function Step1Form({
  form,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  t,
}: {
  form: AnyFormReturn;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  t: TFunction;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    control,
    formState: { errors },
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

function Step2Form({ form, t }: { form: AnyFormReturn; t: TFunction }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    control,
    formState: { errors },
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

function Step3PatientForm({
  form,
  t,
}: {
  form: UseFormReturn<PatientFormValues>;
  t: TFunction;
}) {
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

function Step3ProfessionalForm({
  form,
  t,
}: {
  form: UseFormReturn<ProfessionalFormValues>;
  t: TFunction;
}) {
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
