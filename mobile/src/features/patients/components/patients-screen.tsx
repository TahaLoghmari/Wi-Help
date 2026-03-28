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
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useGetCountries } from "@/api/auth/get-countries";
import { useGetProfessionalPatients } from "@/api/patients/get-professional-patients";
import { useGetConversations } from "@/api/messaging/get-conversations";
import { type PatientDto } from "@/features/patients/types/api.types";
import { ROUTE_PATHS } from "@/config/routes";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/api/notifications/get-notifications";
import { PatientCard } from "./patient-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";

// ─── Main Screen ──────────────────────────────────────────────────────────────

const keyExtractor = (item: PatientDto) => item.id;

export function PatientsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data: user } = useCurrentUser();
  const { data: notificationsData } = useNotifications();
  const hasUnread =
    notificationsData?.pages.flatMap((p) => p.items).some((n) => !n.isRead) ??
    false;
  const { data: countries = [] } = useGetCountries();
  const { data: conversationsData = [] } = useGetConversations();
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

  const handleMessage = useCallback(
    (patient: PatientDto) => {
      const conversation = conversationsData.find(
        (c) => c.otherParticipantId === patient.userId,
      );
      if (!conversation) {
        router.push(ROUTE_PATHS.PROFESSIONAL.MESSAGES);
        return;
      }
      router.push({
        pathname: ROUTE_PATHS.PROFESSIONAL.CONVERSATION_PATHNAME,
        params: {
          id: conversation.id,
          participantId: patient.userId,
          firstName: patient.firstName,
          lastName: patient.lastName,
          profilePictureUrl: patient.profilePictureUrl ?? "",
          backRoute: ROUTE_PATHS.PROFESSIONAL.PATIENTS,
        },
      });
    },
    [conversationsData],
  );

  const handleViewProfile = useCallback((patient: PatientDto) => {
    router.push({
      pathname: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE_PATHNAME,
      params: { id: patient.id, backRoute: ROUTE_PATHS.PROFESSIONAL.PATIENTS },
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
      <AppHeader scrollY={scrollY} user={user} hasUnread={hasUnread} />
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
