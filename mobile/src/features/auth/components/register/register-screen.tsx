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
import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useRegisterPatient } from "@/api/auth/register-patient";
import { useRegisterProfessional } from "@/api/auth/register-professional";
import {
  patientSchema,
  professionalSchema,
  type PatientFormValues,
  type ProfessionalFormValues,
} from "@/features/auth/lib/auth-validation-schemas";
import {
  PatientFormDefaults,
  ProfessionalFormDefaults,
} from "@/features/auth/lib/auth-form-defaults";
import {
  useRegisterRoleStore,
  type RegisterRole,
} from "@/features/auth/stores/use-register-role-store";
import { useStepsStore } from "@/features/auth/stores/use-steps-store";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { cn } from "@/lib/utils";
import { getProgressValue } from "@/features/auth/lib/utils";
import { Step1Form } from "./step-1-form";
import { Step2Form } from "./step-2-form";
import { Step3PatientForm } from "./step-3-patient-form";
import { Step3ProfessionalForm } from "./step-3-professional-form";

const TOTAL_STEPS = 3;

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
    const activeForm = (
      isPatient ? patientForm : professionalForm
    ) as UseFormReturn<FieldValues>;
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
              />
            )}
            {step === 2 && (
              <Step2Form form={isPatient ? patientForm : professionalForm} />
            )}
            {step === 3 && isPatient && <Step3PatientForm form={patientForm} />}
            {step === 3 && !isPatient && (
              <Step3ProfessionalForm form={professionalForm} />
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
