import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useCurrentUser } from "@/entities/session";
import { useGetCountries, useGetStatesByCountry } from "@/entities/location";
import {
  type FullPatientDto,
  useGetCurrentPatient,
  useGetPatientById,
  useGetRelationships,
} from "@/entities/patient";
import { useGetCurrentProfessional } from "@/entities/professional";

import { ReviewsSection } from "@/features/reviews";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = ["overview", "reviews"] as const;
type TabKey = (typeof TABS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDob(dob: string): string {
  return new Date(dob).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <View className="h-px flex-1 bg-brand-secondary/10" />
      <Text className="text-[11px] font-medium tracking-wide uppercase text-brand-secondary/50">
        {title}
      </Text>
      <View className="h-px flex-1 bg-brand-secondary/10" />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3 py-2">
      <View className="w-8 h-8 rounded-lg bg-brand-secondary/8 items-center justify-center mt-0.5">
        <Ionicons name={icon} size={15} color="#00546e" />
      </View>
      <View className="flex-1">
        <Text className="text-[10px] font-medium tracking-wide uppercase text-brand-secondary/50 mb-0.5">
          {label}
        </Text>
        <Text className="text-sm text-brand-dark">{value}</Text>
      </View>
    </View>
  );
}

function TagList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <Text className="text-sm text-brand-secondary/50 italic">
        {emptyLabel}
      </Text>
    );
  }
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {items.map((item, idx) => (
        <View
          key={idx}
          className="border border-brand-secondary/15 rounded-full px-2.5 py-1 bg-brand-bg"
        >
          <Text className="text-xs text-brand-secondary">{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ patient }: { patient: FullPatientDto }) {
  const { t } = useTranslation();
  const { data: countries = [] } = useGetCountries();
  const { data: states = [] } = useGetStatesByCountry(
    patient.address?.countryId ?? "",
  );
  const { data: relationships = [] } = useGetRelationships();

  const relationshipKey = relationships.find(
    (r) => r.id === patient.emergencyContact?.relationshipId,
  )?.key;

  const stateKey = states.find((s) => s.id === patient.address?.stateId)?.key;
  const countryKey = countries.find(
    (c) => c.id === patient.address?.countryId,
  )?.key;

  const addressParts = [
    patient.address?.street,
    patient.address?.city,
    stateKey ? t(`lookups.${stateKey}`) : undefined,
    patient.address?.postalCode,
    countryKey ? t(`lookups.${countryKey}`) : undefined,
  ].filter(Boolean);

  const allergies = (patient.allergies ?? []).map((a) =>
    t(`lookups.allergies.${a.key}`, a.key),
  );
  const conditions = (patient.conditions ?? []).map((c) =>
    t(`lookups.conditions.${c.key}`, c.key),
  );
  const medications = (patient.medications ?? []).map((m) =>
    t(`lookups.medications.${m.key}`, m.key),
  );

  const none = t("patientProfile.overview.none");

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 8,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Patient Details */}
      {patient.mobilityStatus && (
        <>
          <SectionHeader title={t("patientProfile.overview.patientDetails")} />
          <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
            <InfoRow
              icon="accessibility-outline"
              label={t("patientProfile.overview.mobilityStatus")}
              value={t(
                `patientProfile.overview.mobility.${patient.mobilityStatus}`,
                patient.mobilityStatus,
              )}
            />
          </View>
        </>
      )}

      {/* Medical Information */}
      <SectionHeader title={t("patientProfile.overview.medicalInfo")} />
      <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4 gap-4">
        <View>
          <Text className="text-[10px] font-medium tracking-wide uppercase text-brand-secondary/50 mb-2">
            {t("patientProfile.overview.allergies")}
          </Text>
          <TagList items={allergies} emptyLabel={none} />
        </View>
        <View className="h-px bg-brand-secondary/8" />
        <View>
          <Text className="text-[10px] font-medium tracking-wide uppercase text-brand-secondary/50 mb-2">
            {t("patientProfile.overview.conditions")}
          </Text>
          <TagList items={conditions} emptyLabel={none} />
        </View>
        <View className="h-px bg-brand-secondary/8" />
        <View>
          <Text className="text-[10px] font-medium tracking-wide uppercase text-brand-secondary/50 mb-2">
            {t("patientProfile.overview.medications")}
          </Text>
          <TagList items={medications} emptyLabel={none} />
        </View>
      </View>

      {/* Contact Information */}
      <SectionHeader title={t("patientProfile.overview.contactInfo")} />
      <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
        {addressParts.length > 0 && (
          <InfoRow
            icon="location-outline"
            label={t("patientProfile.overview.address")}
            value={addressParts.join(", ")}
          />
        )}
        <InfoRow
          icon="mail-outline"
          label={t("patientProfile.overview.email")}
          value={patient.email}
        />
        <InfoRow
          icon="call-outline"
          label={t("patientProfile.overview.phone")}
          value={patient.phoneNumber}
        />
        <InfoRow
          icon="calendar-outline"
          label={t("patientProfile.overview.dob")}
          value={`${formatDob(patient.dateOfBirth)} · ${calcAge(patient.dateOfBirth)} yrs`}
        />
      </View>

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <>
          <SectionHeader
            title={t("patientProfile.overview.emergencyContact")}
          />
          <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
            <InfoRow
              icon="person-outline"
              label={t("patientProfile.overview.emergency.name")}
              value={patient.emergencyContact.fullName}
            />
            <InfoRow
              icon="call-outline"
              label={t("patientProfile.overview.emergency.phone")}
              value={patient.emergencyContact.phoneNumber}
            />
            {patient.emergencyContact.relationshipId && (
              <InfoRow
                icon="heart-outline"
                label={t("patientProfile.overview.emergency.relationship")}
                value={
                  relationshipKey
                    ? t(`lookups.${relationshipKey}`, relationshipKey)
                    : patient.emergencyContact.relationshipId
                }
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ─── Main Patient Profile Screen ──────────────────────────────────────────────

export interface PatientProfileScreenProps {
  /** Patient ID for professionals/admin fetching a specific patient */
  patientId?: string;
  /** Called when the back button is pressed */
  onBack?: () => void;
}

export function PatientProfileScreen({
  patientId,
  onBack,
}: PatientProfileScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Fade animation for tab content transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { data: currentUser } = useCurrentUser();
  const viewerRole = currentUser?.role ?? "Patient";

  // Fetch professional profile (if viewer is Professional)
  const { data: currentProfessional } = useGetCurrentProfessional();
  const isProfessionalViewer = viewerRole === "Professional";

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
          <OverviewTab patient={patient} />
        ) : (
          <ReviewsSection
            subject={{ id: patient.id, kind: "patient" }}
            viewer={{
              userId: currentUser?.id,
              profileId: isProfessionalViewer
                ? currentProfessional?.id
                : undefined,
              role:
                viewerRole === "Professional"
                  ? "Professional"
                  : viewerRole === "Admin"
                    ? "Admin"
                    : "Patient",
            }}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
