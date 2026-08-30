import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useQueries } from "@tanstack/react-query";
import {
  getStatesByCountryQueryOptions,
  useGetCountries,
} from "@/entities/location";
import {
  type PatientDto,
  useGetProfessionalPatients,
} from "@/entities/patient";
import type { AppHeaderRenderer } from "@/components/app-header";
import { PatientCard } from "./patient-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";

// ─── Main Screen ──────────────────────────────────────────────────────────────

const keyExtractor = (item: PatientDto) => item.id;

interface PatientsScreenProps {
  onMessage: (patient: PatientDto) => void;
  onOpenPatient: (patient: PatientDto) => void;
  renderHeader?: AppHeaderRenderer;
}

export function PatientsScreen({
  onMessage,
  onOpenPatient,
  renderHeader,
}: PatientsScreenProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data: countries = [] } = useGetCountries();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetProfessionalPatients();

  const allPatients = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const countryIds = useMemo(
    () => [
      ...new Set(
        allPatients
          .map((patient) => patient.address?.countryId)
          .filter((countryId): countryId is string => !!countryId),
      ),
    ],
    [allPatients],
  );
  const stateQueries = useQueries({
    queries: countryIds.map((countryId) =>
      getStatesByCountryQueryOptions(countryId),
    ),
  });

  const locationsByPatientId = useMemo(() => {
    const statesByCountryId = new Map(
      countryIds.map(
        (countryId, index) =>
          [countryId, stateQueries[index].data ?? []] as const,
      ),
    );

    return new Map(
      allPatients.map((patient) => {
        const stateKey = statesByCountryId
          .get(patient.address?.countryId ?? "")
          ?.find((state) => state.id === patient.address?.stateId)?.key;
        const countryKey = countries.find(
          (country) => country.id === patient.address?.countryId,
        )?.key;
        const location = [
          patient.address?.city,
          stateKey ? t(`lookups.${stateKey}`) : undefined,
          countryKey ? t(`lookups.${countryKey}`) : undefined,
        ]
          .filter(Boolean)
          .join(", ");

        return [patient.id, location] as const;
      }),
    );
  }, [allPatients, countries, countryIds, stateQueries, t]);

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
        location={locationsByPatientId.get(item.id) ?? ""}
        onMessage={onMessage}
        onViewProfile={onOpenPatient}
      />
    ),
    [locationsByPatientId, onMessage, onOpenPatient],
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
      {renderHeader?.(scrollY)}
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
