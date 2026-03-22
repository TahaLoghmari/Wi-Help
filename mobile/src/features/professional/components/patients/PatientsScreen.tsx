import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  useGetCountries,
  type CountryDto,
} from "@/features/auth/hooks/useGetCountries";
import { useGetStatesByCountry } from "@/features/auth/hooks/useGetStatesByCountry";
import { useGetProfessionalPatients } from "@/features/professional/hooks/useGetProfessionalPatients";
import { type PatientDto } from "@/features/patient/types/api.types";
import { ROUTE_PATHS } from "@/config/routes";
import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
    // Shared values are stable refs — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      className="mx-4 mb-3.5 bg-white rounded-2xl p-4"
    >
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-12 h-12 rounded-full bg-brand-secondary/10" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-32 rounded-full bg-brand-secondary/10" />
          <View className="h-3 w-20 rounded-full bg-brand-secondary/10" />
        </View>
      </View>
      <View className="h-3 w-40 rounded-full bg-brand-secondary/10 mb-2" />
      <View className="h-3 w-56 rounded-full bg-brand-secondary/10 mb-4" />
      <View className="flex-row gap-2">
        <View className="flex-1 h-9 rounded-full bg-brand-secondary/10" />
        <View className="flex-1 h-9 rounded-full bg-brand-secondary/10" />
        <View className="w-9 h-9 rounded-full bg-brand-secondary/10" />
      </View>
    </Animated.View>
  );
}

function LoadingSkeleton() {
  return (
    <View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="items-center mt-16 px-6 gap-3">
      <Ionicons name="people-outline" size={48} color="rgba(0,84,110,0.2)" />
      <Text className="text-base font-semibold text-brand-dark">
        {t("professional.patients.emptyTitle")}
      </Text>
      <Text className="text-sm text-brand-secondary/60 text-center">
        {hasQuery
          ? t("professional.patients.emptySearchSubtitle")
          : t("professional.patients.emptySubtitle")}
      </Text>
    </View>
  );
}

// ─── Patient Card ─────────────────────────────────────────────────────────────

interface PatientCardProps {
  patient: PatientDto;
  countries: CountryDto[];
  onMessage: (patient: PatientDto) => void;
  onViewProfile: (patient: PatientDto) => void;
}

const PatientCard = React.memo(function PatientCard({
  patient,
  countries,
  onMessage,
  onViewProfile,
}: PatientCardProps) {
  const { t } = useTranslation();
  const age = calcAge(patient.dateOfBirth);
  const initials = getInitials(patient.firstName, patient.lastName);

  const { data: states } = useGetStatesByCountry(
    patient.address?.countryId ?? "",
  );

  const stateKey = states?.find((s) => s.id === patient.address?.stateId)?.key;
  const countryKey = countries.find(
    (c) => c.id === patient.address?.countryId,
  )?.key;
  const locationParts = [
    patient.address?.city,
    stateKey ? t(`lookups.${stateKey}`) : undefined,
    countryKey ? t(`lookups.${countryKey}`) : undefined,
  ].filter(Boolean);
  const location = locationParts.join(", ");

  return (
    <View style={styles.card} className="mx-4 mb-3.5 bg-white rounded-2xl p-4">
      {/* Row 1 — Identity */}
      <View className="flex-row items-center gap-3 mb-3">
        {patient.profilePictureUrl ? (
          <Image
            source={{ uri: patient.profilePictureUrl }}
            style={styles.avatar}
            contentFit="cover"
            accessibilityLabel={`${patient.firstName} ${patient.lastName}`}
          />
        ) : (
          <View
            style={styles.avatar}
            className="rounded-full bg-brand-teal/15 items-center justify-center"
            accessibilityLabel={`${patient.firstName} ${patient.lastName}`}
          >
            <Text className="text-brand-dark font-semibold text-sm">
              {initials}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text
            className="font-bold text-brand-dark text-base"
            numberOfLines={1}
          >
            {patient.firstName} {patient.lastName}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-brand-secondary/10 rounded-full px-2 py-0.5">
              <Text className="text-brand-secondary text-[10px] font-semibold">
                {age} · {patient.gender}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Row 2 — Location */}
      {location ? (
        <View className="flex-row items-center gap-1.5 mb-2">
          <Ionicons
            name="location-outline"
            size={13}
            color="rgba(0,84,110,0.5)"
          />
          <Text className="text-xs text-brand-secondary/70" numberOfLines={1}>
            {location}
          </Text>
        </View>
      ) : null}

      {/* Row 3 — Contact */}
      <View className="flex-row items-center gap-4 mb-4">
        <View className="flex-row items-center gap-1.5 flex-1">
          <Ionicons name="call-outline" size={13} color="rgba(0,84,110,0.5)" />
          <Text
            className="text-xs text-brand-secondary/70 flex-1"
            numberOfLines={1}
          >
            {patient.phoneNumber}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5 flex-1">
          <Ionicons name="mail-outline" size={13} color="rgba(0,84,110,0.5)" />
          <Text
            className="text-xs text-brand-secondary/70 flex-1"
            numberOfLines={1}
          >
            {patient.email}
          </Text>
        </View>
      </View>

      {/* Row 4 — Action buttons */}
      <View className="flex-row items-center gap-2">
        <Pressable
          className={clsx(
            "flex-1 flex-row items-center justify-center gap-1.5",
            "bg-brand-dark py-2.5 rounded-full active:opacity-80",
          )}
          onPress={() => onMessage(patient)}
          accessibilityLabel={`Message ${patient.firstName} ${patient.lastName}`}
          accessibilityRole="button"
        >
          <Ionicons name="chatbubble-outline" size={13} color="white" />
          <Text className="text-white text-xs font-bold">
            {t("professional.patients.actions.message")}
          </Text>
        </Pressable>

        <Pressable
          className={clsx(
            "flex-1 flex-row items-center justify-center gap-1.5",
            "border border-brand-dark/20 py-2.5 rounded-full active:opacity-80",
          )}
          onPress={() => onViewProfile(patient)}
          accessibilityLabel={`View profile of ${patient.firstName} ${patient.lastName}`}
          accessibilityRole="button"
        >
          <Ionicons name="person-outline" size={13} color="#00394a" />
          <Text className="text-brand-dark text-xs font-bold">
            {t("professional.patients.actions.viewProfile")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const keyExtractor = (item: PatientDto) => item.id;

export function PatientsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data: user } = useCurrentUser();
  const { data: countries = [] } = useGetCountries();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetProfessionalPatients();

  const allPatients = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const filtered = useMemo(() => {
    if (!query.trim()) return allPatients;
    const q = query.toLowerCase();
    return allPatients.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.phoneNumber.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [allPatients, query]);

  const handleMessage = useCallback((_patient: PatientDto) => {
    router.push(ROUTE_PATHS.PROFESSIONAL.MESSAGES);
  }, []);

  const handleViewProfile = useCallback((patient: PatientDto) => {
    router.push({
      pathname: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE_PATHNAME,
      params: { id: patient.id },
    });
  }, []);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const listHeader = (
    <View className="pt-4 pb-2 gap-4 px-4">
      {/* Page title */}
      <View className="gap-1">
        <Text className="text-2xl font-semibold tracking-tight text-brand-dark">
          {t("professional.patients.title")}
        </Text>
        <Text className="text-base text-brand-secondary/80">
          {t("professional.patients.subtitle")}
        </Text>
      </View>

      {/* Search bar */}
      <View className="flex-row items-center gap-3 rounded-2xl border border-brand-secondary/15 bg-white px-4">
        <Ionicons name="search-outline" size={18} color="rgba(0,84,110,0.45)" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("professional.patients.searchPlaceholder")}
          placeholderTextColor="rgba(0,84,110,0.35)"
          className="flex-1 text-brand-dark text-sm"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search patients"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color="rgba(0,84,110,0.45)"
            />
          </Pressable>
        )}
      </View>

      {/* Patient count pill */}
      {!isLoading && (
        <View className="items-end">
          <View className="bg-brand-teal/10 rounded-full px-3 py-1">
            <Text className="text-brand-dark text-xs font-semibold">
              {query.trim() ? filtered.length : totalCount}{" "}
              {(query.trim() ? filtered.length : totalCount) === 1
                ? t("professional.patients.countSingular")
                : t("professional.patients.countPlural")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: PatientDto }) => (
      <PatientCard
        patient={item}
        countries={countries}
        onMessage={handleMessage}
        onViewProfile={handleViewProfile}
      />
    ),
    [countries, handleMessage, handleViewProfile],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listFooter = isFetchingNextPage ? (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color="#00546e" />
    </View>
  ) : null;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ProfessionalAppHeader scrollY={scrollY} />
      <Animated.FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <LoadingSkeleton />
          ) : (
            <EmptyState hasQuery={query.length > 0} />
          )
        }
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
