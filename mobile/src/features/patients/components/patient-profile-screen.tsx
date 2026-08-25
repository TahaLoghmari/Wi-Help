import React, {
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import {
  type FullPatientDto,
  useGetCurrentPatient,
  useGetPatientById,
} from "@/entities/patient";
import { PatientProfileOverview } from "./patient-profile-overview";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = ["overview", "reviews"] as const;
type TabKey = (typeof TABS)[number];

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Main Patient Profile Screen ──────────────────────────────────────────────

export interface PatientProfileScreenProps {
  /** Patient ID for professionals/admin fetching a specific patient */
  patientId?: string;
  /** Called when the back button is pressed */
  onBack?: () => void;
  /** App-layer composition for the review feature. */
  renderReviews: (patientId: string) => React.ReactNode;
}

export function PatientProfileScreen({
  patientId,
  onBack,
  renderReviews,
}: PatientProfileScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Fade animation for tab content transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fetch patient data
  const isOwnProfile = !patientId;
  const {
    data: ownPatient,
    isPending: ownPending,
    isError: ownError,
  } = useGetCurrentPatient();
  const {
    data: byIdPatient,
    isPending: byIdPending,
    isError: byIdError,
  } = useGetPatientById(patientId);

  const patient: FullPatientDto | undefined = isOwnProfile
    ? ownPatient
    : byIdPatient;
  const isPending = isOwnProfile ? ownPending : byIdPending;
  const isError = isOwnProfile ? ownError : byIdError;

  const switchTab = useCallback(
    (tab: TabKey) => {
      if (tab === activeTab) return;
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      setActiveTab(tab);
    },
    [activeTab, fadeAnim],
  );

  // Compute display values
  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : "—";
  const initials = patient
    ? getInitials(patient.firstName, patient.lastName)
    : "?";

  const screenTitle = isOwnProfile
    ? t("patientProfile.myProfile")
    : t("patientProfile.title");

  // ── Loading state ──
  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          {onBack && (
            <Pressable
              className="w-9 h-9 rounded-full border border-brand-secondary/15 items-center justify-center"
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel={t("common.back")}
            >
              <Ionicons name="chevron-back" size={20} color="#00394a" />
            </Pressable>
          )}
          <Text className="text-lg font-semibold text-brand-dark tracking-tight">
            {screenTitle}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00546e" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error state ──
  if (isError || !patient) {
    return (
      <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          {onBack && (
            <Pressable
              className="w-9 h-9 rounded-full border border-brand-secondary/15 items-center justify-center"
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel={t("common.back")}
            >
              <Ionicons name="chevron-back" size={20} color="#00394a" />
            </Pressable>
          )}
          <Text className="text-lg font-semibold text-brand-dark tracking-tight">
            {screenTitle}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6 gap-3">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color="rgba(0,84,110,0.2)"
          />
          <Text className="text-base font-semibold text-brand-dark">
            {t("errors.unexpected")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      {/* ── Top bar ── */}
      <View className="flex-row items-center gap-3 px-4 py-3 bg-white ">
        {onBack && (
          <Pressable
            className="w-9 h-9 rounded-full border border-brand-secondary/15 items-center justify-center"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
          >
            <Ionicons name="chevron-back" size={20} color="#00394a" />
          </Pressable>
        )}
        <Text className="text-lg font-semibold text-brand-dark tracking-tight flex-1">
          {screenTitle}
        </Text>
      </View>

      {/* ── Profile header ── */}
      <View className="bg-white px-4 pt-4 pb-4">
        <View className="flex-row items-start gap-4">
          {/* Avatar */}
          {patient.profilePictureUrl ? (
            <Image
              source={{ uri: patient.profilePictureUrl }}
              style={{ width: 72, height: 72, borderRadius: 36 }}
              contentFit="cover"
              accessibilityLabel={patientName}
            />
          ) : (
            <View
              className="w-[72px] h-[72px] rounded-full bg-brand-teal/15 items-center justify-center border-2 border-brand-teal/20"
              accessibilityLabel={patientName}
            >
              <Text className="text-brand-dark font-bold text-xl">
                {initials}
              </Text>
            </View>
          )}

          {/* Name + meta */}
          <View className="flex-1 pt-1">
            <Text
              className="text-xl font-semibold text-brand-dark tracking-tight"
              numberOfLines={2}
            >
              {patientName}
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View className="flex-row items-center gap-1.5 border border-brand-dark/10 bg-brand-bg rounded-md px-2.5 py-1">
                <Ionicons name="person-outline" size={14} color="#00546e" />
                <Text className="text-xs font-medium text-brand-dark">
                  {patient.gender}
                </Text>
              </View>
            </View>

            {patient.bio && (
              <Text
                className="text-xs text-brand-secondary/70 mt-2 leading-relaxed"
                numberOfLines={3}
              >
                {patient.bio}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View className="flex-row border-b border-brand-secondary/10 bg-white">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => switchTab(tab)}
              className="flex-1 items-center py-3"
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                className={`text-sm font-medium tracking-tight ${
                  isActive ? "text-brand-dark" : "text-brand-secondary/50"
                }`}
              >
                {t(`patientProfile.tabs.${tab}`)}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-brand-dark" />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* ── Tab content (animated fade) ── */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {activeTab === "overview" ? (
          <PatientProfileOverview patient={patient} />
        ) : (
          renderReviews(patient.id)
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
