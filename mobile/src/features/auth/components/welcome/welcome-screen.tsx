import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useBounce } from "@/features/auth/hooks/use-bounce";

export function WelcomeScreen() {
  const { t, i18n } = useTranslation();
  const { goToLogin, goToRegister } = useAppNavigation();

  const currentLang = i18n.language?.slice(0, 2) ?? "en";
  const toggleLang = () => {
    const next = currentLang === "en" ? "fr" : "en";
    void i18n.changeLanguage(next);
  };

  const floatHeart = useBounce(3000, 0);
  const floatStethoscope = useBounce(4000, 500);
  const floatDot = useBounce(3500, 1000);

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="flex-1 px-6 pb-8">
        {/* Language toggle — top right */}
        <View className="items-end pt-2">
          <Pressable
            className="flex-row items-center gap-x-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5"
            onPress={toggleLang}
            accessibilityLabel="Switch language"
            accessibilityRole="button"
          >
            <Ionicons name="globe-outline" size={15} color="#00546e" />
            <Text className="text-sm font-medium text-brand-secondary">
              {currentLang === "en" ? "FR" : "EN"}
            </Text>
          </Pressable>
        </View>

        {/* Illustration area */}
        <View className="flex-1 items-center justify-center">
          {/* Logo with floating elements */}
          <View className="mb-10 h-64 w-64 items-center justify-center">
            {/* Background glow */}
            <View style={[StyleSheet.absoluteFillObject, styles.glowCircle]} />

            {/* Main center circle */}
            <View className="h-40 w-40 items-center justify-center rounded-full border border-white bg-[#f4fcf9]">
              <View
                className="h-24 w-24 items-center justify-center rounded-2xl border border-gray-50 bg-white"
                style={styles.logoInner}
              >
                <Image
                  source={require("@/assets/images/icon-2.png")}
                  className="h-14 w-14"
                  resizeMode="contain"
                  accessibilityLabel="Wi Help logo"
                />
              </View>
            </View>

            {/* Floating — heart (top right) */}
            <Animated.View style={[styles.floatTopRight, floatHeart]}>
              <View
                className="rounded-full border border-gray-50 bg-white p-3"
                style={styles.floatShadow}
              >
                <Ionicons name="heart-outline" size={22} color="#14d3ac" />
              </View>
            </Animated.View>

            {/* Floating — stethoscope equiv (bottom left) */}
            <Animated.View style={[styles.floatBottomLeft, floatStethoscope]}>
              <View
                className="rounded-full border border-gray-50 bg-white p-2.5"
                style={styles.floatShadow}
              >
                <Ionicons name="pulse-outline" size={18} color="#00e984" />
              </View>
            </Animated.View>

            {/* Floating — small blue dot (middle right) */}
            <Animated.View style={[styles.floatMidRight, floatDot]}>
              <View
                className="rounded-full border border-gray-50 bg-white p-1.5"
                style={styles.floatShadow}
              >
                <View style={styles.blueDot} />
              </View>
            </Animated.View>
          </View>

          {/* Text */}
          <View className="items-center px-4">
            <Text className="mb-3 text-center text-3xl font-semibold text-brand-dark">
              {t("auth.welcome.title")}
            </Text>
            <Text className="text-center text-sm font-medium text-gray-500">
              {t("auth.welcome.tagline")}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View className="gap-y-3">
          <Button
            onPress={goToLogin}
            accessibilityLabel={t("auth.welcome.signIn")}
          >
            {t("auth.welcome.signIn")}
          </Button>
          <Button
            variant="outline"
            onPress={goToRegister}
            accessibilityLabel={t("auth.welcome.getStarted")}
          >
            {t("auth.welcome.getStarted")}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  glowCircle: {
    borderRadius: 9999,
    backgroundColor: "#e6fbf6",
    opacity: 0.7,
  },
  logoInner: {
    // slight rotation matching the HTML rotate-3
    transform: [{ rotate: "3deg" }],
    shadowColor: "#14d3ac",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  floatShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  floatTopRight: {
    position: "absolute",
    top: 24,
    right: 32,
  },
  floatBottomLeft: {
    position: "absolute",
    bottom: 32,
    left: 24,
  },
  floatMidRight: {
    position: "absolute",
    top: "50%",
    right: -4,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3fa6ff",
    opacity: 0.8,
  },
});
