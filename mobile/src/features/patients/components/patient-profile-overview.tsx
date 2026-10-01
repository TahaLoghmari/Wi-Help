import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useGetCountries, useGetStatesByCountry } from "@/shared/api/location";
import {
  type FullPatientDto,
  useGetRelationships,
} from "@/features/patients/api";

function calcAge(dob: string, now: Date): number {
  const birth = new Date(dob);
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDob(dob: string): string {
  return new Date(dob).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

function TagList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return (
      <Text className="text-sm text-brand-secondary/50 italic">
        {emptyLabel}
      </Text>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-1.5">
      {items.map((item, index) => (
        <View
          key={index}
          className="border border-brand-secondary/15 rounded-full px-2.5 py-1 bg-brand-bg"
        >
          <Text className="text-xs text-brand-secondary">{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function PatientProfileOverview({
  patient,
}: {
  patient: FullPatientDto;
}) {
  const { t } = useTranslation();
  const { data: countries = [] } = useGetCountries();
  const { data: states = [] } = useGetStatesByCountry(
    patient.address?.countryId ?? "",
  );
  const { data: relationships = [] } = useGetRelationships();

  const relationshipKey = relationships.find(
    (relationship) =>
      relationship.id === patient.emergencyContact?.relationshipId,
  )?.key;
  const stateKey = states.find(
    (state) => state.id === patient.address?.stateId,
  )?.key;
  const countryKey = countries.find(
    (country) => country.id === patient.address?.countryId,
  )?.key;
  const addressParts = [
    patient.address?.street,
    patient.address?.city,
    stateKey ? t(`lookups.${stateKey}`) : undefined,
    patient.address?.postalCode,
    countryKey ? t(`lookups.${countryKey}`) : undefined,
  ].filter(Boolean);
  const allergies = (patient.allergies ?? []).map((allergy) =>
    t(`lookups.allergies.${allergy.key}`, allergy.key),
  );
  const conditions = (patient.conditions ?? []).map((condition) =>
    t(`lookups.conditions.${condition.key}`, condition.key),
  );
  const medications = (patient.medications ?? []).map((medication) =>
    t(`lookups.medications.${medication.key}`, medication.key),
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
          value={`${formatDob(patient.dateOfBirth)} · ${calcAge(patient.dateOfBirth, new Date())} yrs`}
        />
      </View>

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
