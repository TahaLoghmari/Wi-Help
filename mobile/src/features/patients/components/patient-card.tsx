import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { type CountryDto } from "@/types/enums.types";
import { useGetStatesByCountry } from "@/api/auth/get-states";
import { type PatientDto } from "@/features/patients/types/api.types";
import { calcAge, getInitials } from "@/features/patients/lib/utils";

interface PatientCardProps {
  patient: PatientDto;
  countries: CountryDto[];
  onMessage: (patient: PatientDto) => void;
  onViewProfile: (patient: PatientDto) => void;
}

export const PatientCard = React.memo(function PatientCard({
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
