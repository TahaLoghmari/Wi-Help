import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/lib/authValidationSchemas";
import { LoginFormDefaults } from "@/features/auth/lib/authFormDefaults";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export function LoginScreen() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const { goToRegister, goToWelcome } = useAppNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: LoginFormDefaults(),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

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
          onPress={goToWelcome}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#00394a" />
        </Pressable>

        <View className="px-6 pb-10 pt-6">
          {/* Logo & branding */}
          <View className="mb-10">
            <View className="mb-8 flex-row items-center gap-x-2.5">
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
              {t("auth.welcomeBack")}
            </Text>
            <Text className="mt-3 text-base text-brand-secondary opacity-80">
              {t("auth.loginDescription")}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-5">
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
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      placeholder={t("auth.emailPlaceholder")}
                      accessibilityLabel={t("common.email")}
                      className="pl-11"
                    />
                  )}
                />
                <View
                  className="absolute left-3.5 top-3.5"
                  pointerEvents="none"
                >
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                </View>
              </View>
            </View>

            {/* Password */}
            <View className="gap-y-1.5">
              <Text className="text-base font-medium text-brand-dark">
                {t("common.password")}
              </Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry={!showPassword}
                      placeholder={t("auth.passwordPlaceholder")}
                      accessibilityLabel={t("common.password")}
                      className="pl-11 pr-11"
                    />
                  )}
                />
                <View
                  className="absolute left-3.5 top-3.5"
                  pointerEvents="none"
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
                <Pressable
                  className="absolute right-3.5 top-3.5"
                  onPress={() => setShowPassword((v) => !v)}
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

            {/* Remember me + Forgot password */}
            <View className="flex-row items-center justify-between pt-1">
              <Pressable
                className="flex-row items-center gap-x-3"
                onPress={() => setRememberMe((v) => !v)}
                accessibilityLabel={t("auth.rememberMe")}
                accessibilityRole="checkbox"
              >
                <View
                  className={cn(
                    "h-5 w-5 items-center justify-center rounded-md border-2",
                    rememberMe
                      ? "border-brand-teal bg-brand-teal"
                      : "border-gray-200 bg-white",
                  )}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text className="text-base text-brand-secondary">
                  {t("auth.rememberMe")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {}}
                accessibilityLabel={t("auth.forgotPassword")}
                accessibilityRole="button"
              >
                <Text className="text-base font-medium text-brand-teal">
                  {t("auth.forgotPassword")}
                </Text>
              </Pressable>
            </View>

            {/* Sign in button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              accessibilityLabel={t("auth.signIn")}
              className="mt-1"
            >
              {t("auth.signIn")}
            </Button>
          </View>

          {/* Divider */}
          <View className="my-8 flex-row items-center gap-x-4">
            <View className="flex-1 border-t border-gray-100" />
            <Text className="text-base text-gray-400">
              {t("auth.orContinueWith")}
            </Text>
            <View className="flex-1 border-t border-gray-100" />
          </View>

          {/* Google button */}
          <Pressable
            className="flex-row items-center justify-center gap-x-2.5 rounded-xl border border-gray-200 bg-white py-3 active:bg-gray-50"
            onPress={() => {}}
            accessibilityLabel="Sign in with Google"
            accessibilityRole="button"
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text className="text-base font-medium text-brand-dark">
              Google
            </Text>
          </Pressable>
        </View>

        {/* Sign up link */}
        <View className="flex-row items-center justify-center pb-8">
          <Text className="text-base text-brand-secondary">
            {t("auth.dontHaveAccount")}{" "}
          </Text>
          <Pressable
            onPress={goToRegister}
            accessibilityLabel={t("auth.welcome.getStarted")}
            accessibilityRole="button"
          >
            <Text className="text-base font-medium text-brand-teal">
              {t("auth.welcome.getStarted")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
