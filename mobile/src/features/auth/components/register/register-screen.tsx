import React, { useReducer, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useRegisterPatient } from "@/features/auth/api/register-patient";
import { useRegisterProfessional } from "@/features/auth/api/register-professional";
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
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { cn } from "@/lib/utils";
import { getProgressValue } from "@/features/auth/lib/utils";
import { Step1Form } from "./step-1-form";
import { Step2Form } from "./step-2-form";
import { Step3PatientForm } from "./step-3-patient-form";
import { Step3ProfessionalForm } from "./step-3-professional-form";
import { type RegisterFieldPath } from "./register-types";
import {
  initialRegistrationFlowState,
  registrationFlowReducer,
  type RegisterRole,
} from "./registration-flow";

const TOTAL_STEPS = 3;

// ── RegisterScreen ────────────────────────────────────────────────────────────

export function RegisterScreen() {
  const { t } = useTranslation();
  const { goToLogin, goBack } = useAppNavigation();
  const handleApiError = useHandleApiError();
  const [{ role: registerRole, step }, dispatch] = useReducer(
    registrationFlowReducer,
    initialRegistrationFlowState,
  );

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
    dispatch({ type: "set-role", role });
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
  ] satisfies RegisterFieldPath[];

  const step2Fields = [
    "address.street",
    "address.city",
    "address.postalCode",
    "address.countryId",
    "address.stateId",
  ] satisfies RegisterFieldPath[];

  const handleNext = async () => {
    const fields = step === 1 ? step1Fields : step2Fields;
    const isValid = isPatient
      ? await patientForm.trigger(fields)
      : await professionalForm.trigger(fields);
    if (isValid) dispatch({ type: "next" });
  };

  const registrationCallbacks = {
    onSuccess: () => {
      dispatch({ type: "reset" });
      Toast.show({
        type: "success",
        text1: t("auth.accountCreated"),
        text2: t("auth.checkEmailToConfirm"),
      });
      goToLogin();
    },
    onError: handleApiError,
  };

  const handleSubmit = () => {
    if (isPatient) {
      patientForm.handleSubmit((data) => {
        registerPatient.mutate(
          { ...data, role: "patient" },
          registrationCallbacks,
        );
      })();
    } else {
      professionalForm.handleSubmit((data) => {
        registerProfessional.mutate(data, registrationCallbacks);
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
                  source={require("../../../../../assets/images/icon-2.png")}
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
                onPress={() => dispatch({ type: "previous" })}
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
