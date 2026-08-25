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
  useGetProfessionalAwards,
  useGetProfessionalById,
  useGetProfessionalDocuments,
  useGetProfessionalEducations,
  useGetProfessionalExperiences,
} from "@/entities/professional";
import { ProfessionalProfileOverview } from "./professional-profile-overview";
import { ProfessionalProfileSchedule } from "./professional-profile-schedule";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = ["overview", "schedule", "reviews"] as const;
type TabKey = (typeof TABS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Main Professional Profile Screen ────────────────────────────────────────

export interface ProfessionalProfileScreenProps {
  /** Professional ID to view */
  professionalId: string;
  /** Called when the back button is pressed */
  onBack?: () => void;
  /** App-layer composition for the review feature. */
  renderReviews: (professionalId: string) => React.ReactNode;
}

export function ProfessionalProfileScreen({
  professionalId,
  onBack,
  renderReviews,
}: ProfessionalProfileScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Fade animation for tab content transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Professional profile data
  const {
    data: professional,
    isPending,
    isError,
  } = useGetProfessionalById(professionalId);

  // Extra profile data (fetched in parallel)
  const { data: educations = [], isLoading: isEdLoading } =
    useGetProfessionalEducations(professionalId);
  const { data: experiences = [], isLoading: isExpLoading } =
    useGetProfessionalExperiences(professionalId);
  const { data: awards = [], isLoading: isAwardLoading } =
    useGetProfessionalAwards(professionalId);
  const { data: documents = [], isLoading: isDocLoading } =
    useGetProfessionalDocuments(professionalId);

  const isLoadingExtras =
    isEdLoading || isExpLoading || isAwardLoading || isDocLoading;

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

  const screenTitle = t("professionalProfile.title");

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
  if (isError || !professional) {
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

  const professionalName = `${professional.firstName} ${professional.lastName}`;
  const initials = getInitials(professional.firstName, professional.lastName);
  const isVerified = professional.verificationStatus === "Verified";

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      {/* ── Top bar ── */}
      <View className="flex-row items-center gap-3 px-4 py-3 bg-white">
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
        <Text
          className="text-lg font-semibold text-brand-dark tracking-tight flex-1"
          numberOfLines={1}
        >
          {screenTitle}
        </Text>
      </View>

      {/* ── Profile header ── */}
      <View className="bg-white px-4">
        <View className="flex-row items-start gap-4">
          {/* Avatar */}
          {professional.profilePictureUrl ? (
            <View>
              <Image
                source={{ uri: professional.profilePictureUrl }}
                style={{ width: 72, height: 72, borderRadius: 36 }}
                contentFit="cover"
                accessibilityLabel={professionalName}
              />
              {isVerified && (
                <View
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-teal items-center justify-center"
                  style={{ borderWidth: 2, borderColor: "white" }}
                >
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
              )}
            </View>
          ) : (
            <View>
              <View
                className="w-[72px] h-[72px] rounded-full bg-brand-teal/15 items-center justify-center border-2 border-brand-teal/20"
                accessibilityLabel={professionalName}
              >
                <Text className="text-brand-dark font-bold text-xl">
                  {initials}
                </Text>
              </View>
              {isVerified && (
                <View
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-teal items-center justify-center"
                  style={{ borderWidth: 2, borderColor: "white" }}
                >
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
              )}
            </View>
          )}

          {/* Name + meta */}
          <View className="flex-1 pt-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text
                className="text-xl font-semibold text-brand-dark tracking-tight"
                numberOfLines={2}
              >
                {professionalName}
              </Text>
              {isVerified && (
                <View className="flex-row items-center gap-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-2 py-0.5">
                  <Ionicons name="checkmark-circle" size={11} color="#14d3ac" />
                  <Text className="text-[10px] font-semibold text-brand-dark">
                    {t(
                      "professionalProfile.overview.verificationStatus_Verified",
                    )}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-2 mt-1 flex-wrap">
              <View className="flex-row items-center gap-1.5 border border-brand-dark/10 bg-brand-bg rounded-md px-2.5 py-1">
                <Ionicons name="person-outline" size={14} color="#00546e" />
                <Text className="text-xs font-medium text-brand-dark">
                  {professional.gender}
                </Text>
              </View>
            </View>

            {professional.bio ? (
              <Text
                className="text-xs text-brand-secondary/70 mt-2 leading-relaxed"
                numberOfLines={3}
              >
                {professional.bio}
              </Text>
            ) : null}
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
                {t(`professionalProfile.tabs.${tab}`)}
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
          <ProfessionalProfileOverview
            professional={professional}
            educations={educations}
            experiences={experiences}
            awards={awards}
            documents={documents}
            isLoadingExtras={isLoadingExtras}
          />
        ) : activeTab === "schedule" ? (
          <ProfessionalProfileSchedule professionalId={professionalId} />
        ) : (
          renderReviews(professionalId)
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
