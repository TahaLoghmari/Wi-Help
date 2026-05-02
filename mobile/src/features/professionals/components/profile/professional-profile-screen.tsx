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
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { useCurrentUser } from "@/api/auth/use-current-user";
import { useGetCurrentPatient } from "@/api/patients/get-current-patient";
import { useGetProfessionalById } from "@/api/professionals/get-professional-by-id";
import { useGetProfessionalEducations } from "@/api/professionals/get-professional-educations";
import { useGetProfessionalExperiences } from "@/api/professionals/get-professional-experiences";
import { useGetProfessionalAwards } from "@/api/professionals/get-professional-awards";
import { useGetProfessionalDocuments } from "@/api/professionals/get-professional-documents";
import { useGetSchedule } from "@/api/professionals/get-schedule";
import { useGetProfessionalReviews } from "@/api/reviews/get-professional-reviews";
import { useGetProfessionalReviewStats } from "@/api/reviews/get-professional-review-stats";
import { useSubmitProfessionalReview } from "@/api/reviews/submit-professional-review";
import { useUpdateReview } from "@/api/reviews/update-review";
import { useDeleteReview } from "@/api/reviews/delete-review";
import { useToggleReviewLike } from "@/api/reviews/like-review";
import { useReplyToReview } from "@/api/reviews/reply-to-review";
import { useEditReply } from "@/api/reviews/edit-reply";
import { useDeleteReply } from "@/api/reviews/delete-reply";
import { useGetCountries } from "@/api/auth/get-countries";
import { useGetStatesByCountry } from "@/api/auth/get-states";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
// eslint-disable-next-line import/no-restricted-paths
import { PatientReviewCard } from "@/features/reviews/components/patient-review-card";
// eslint-disable-next-line import/no-restricted-paths
import { AddPatientReviewForm } from "@/features/reviews/components/add-patient-review-form";

import {
  DISPLAY_ORDER,
  DAY_KEYS,
  mergeWithAllDays,
} from "@/features/professionals/lib/utils";
import type {
  FullProfessionalDto,
  ProfessionalEducationDto,
  ProfessionalExperienceDto,
  ProfessionalAwardDto,
  ProfessionalDocumentDto,
  DocumentType,
} from "@/features/professionals/types/profile.types";
// eslint-disable-next-line import/no-restricted-paths
import type { ReviewDto } from "@/features/reviews/types/api.types";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = ["overview", "schedule", "reviews"] as const;
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

// ─── Verification Status Badge ────────────────────────────────────────────────

function VerificationBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  if (status === "Verified") {
    return (
      <View className="self-start flex-row items-center gap-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-2.5 py-1">
        <Ionicons name="checkmark-circle" size={12} color="#14d3ac" />
        <Text className="text-[11px] font-semibold text-brand-dark">
          {t("professionalProfile.overview.verificationStatus_Verified")}
        </Text>
      </View>
    );
  }
  if (status === "Rejected") {
    return (
      <View className="self-start flex-row items-center gap-1 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-2.5 py-1">
        <Ionicons name="close-circle" size={12} color="#00546e" />
        <Text className="text-[11px] font-semibold text-brand-secondary">
          {t("professionalProfile.overview.verificationStatus_Rejected")}
        </Text>
      </View>
    );
  }
  // Pending
  return (
    <View className="self-start flex-row items-center gap-1 rounded-full border border-brand-cream bg-brand-cream/20 px-2.5 py-1">
      <Ionicons name="time-outline" size={12} color="#00546e" />
      <Text className="text-[11px] font-semibold text-brand-secondary">
        {t("professionalProfile.overview.verificationStatus_Pending")}
      </Text>
    </View>
  );
}

// ─── Document Status Chip ─────────────────────────────────────────────────────

function DocumentStatusChip({ status }: { status: string | "NotUploaded" }) {
  const { t } = useTranslation();
  if (status === "Verified") {
    return (
      <View className="flex-row items-center gap-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-2 py-0.5">
        <View className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
        <Text className="text-[10px] font-medium text-brand-dark">
          {t("professionalProfile.overview.docVerified")}
        </Text>
      </View>
    );
  }
  if (status === "Rejected") {
    return (
      <View className="flex-row items-center gap-1 rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-2 py-0.5">
        <View className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
        <Text className="text-[10px] font-medium text-brand-secondary">
          {t("professionalProfile.overview.docRejected")}
        </Text>
      </View>
    );
  }
  if (status === "Pending") {
    return (
      <View className="flex-row items-center gap-1 rounded-full border border-brand-cream bg-brand-cream/20 px-2 py-0.5">
        <View className="w-1.5 h-1.5 rounded-full bg-brand-secondary/60" />
        <Text className="text-[10px] font-medium text-brand-secondary/70">
          {t("professionalProfile.overview.docPending")}
        </Text>
      </View>
    );
  }
  // NotUploaded
  return (
    <View className="flex-row items-center gap-1 rounded-full border border-brand-secondary/15 bg-brand-bg px-2 py-0.5">
      <View className="w-1.5 h-1.5 rounded-full bg-brand-secondary/30" />
      <Text className="text-[10px] font-medium text-brand-secondary/50">
        {t("professionalProfile.overview.docNotUploaded")}
      </Text>
    </View>
  );
}

// ─── Review Stats Header ──────────────────────────────────────────────────────

function ReviewStatsHeader({
  averageRating,
  totalCount,
}: {
  averageRating: number;
  totalCount: number;
}) {
  const filledStars = Math.round(averageRating);
  return (
    <View className="flex-row items-center mb-4">
      <View
        className="flex-row items-center gap-1 rounded-full border border-brand-secondary/15 bg-white px-2.5 py-1"
        style={{ alignSelf: "flex-start" }}
      >
        <View className="flex-row items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={11}
              color={i < filledStars ? "#f5a623" : "rgba(0,84,110,0.15)"}
            />
          ))}
        </View>
        <Text className="ml-1 text-[12px] font-semibold text-brand-dark">
          {averageRating.toFixed(1)}
        </Text>
        <Text className="text-[11px] text-brand-secondary/50">
          ({totalCount})
        </Text>
      </View>
    </View>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

interface OverviewTabProps {
  professional: FullProfessionalDto;
  educations: ProfessionalEducationDto[];
  experiences: ProfessionalExperienceDto[];
  awards: ProfessionalAwardDto[];
  documents: ProfessionalDocumentDto[];
  isLoadingExtras: boolean;
}

const DOCUMENT_TYPES: DocumentType[] = [
  "Diploma",
  "ProfessionalLicense",
  "Id",
  "Insurance",
];

function OverviewTab({
  professional,
  educations,
  experiences,
  awards,
  documents,
  isLoadingExtras,
}: OverviewTabProps) {
  const { t } = useTranslation();
  const { data: countries = [] } = useGetCountries();
  const { data: states = [] } = useGetStatesByCountry(
    professional.address?.countryId ?? "",
  );

  const stateKey = states.find(
    (s) => s.id === professional.address?.stateId,
  )?.key;
  const countryKey = countries.find(
    (c) => c.id === professional.address?.countryId,
  )?.key;

  const addressParts = [
    professional.address?.street,
    professional.address?.city,
    stateKey ? t(`lookups.${stateKey}`) : undefined,
    professional.address?.postalCode,
    countryKey ? t(`lookups.${countryKey}`) : undefined,
  ].filter(Boolean);

  // Build a map of uploaded documents keyed by type
  const documentMap = useMemo(() => {
    const map = new Map<DocumentType, ProfessionalDocumentDto>();
    (documents ?? []).forEach((doc) => map.set(doc.type, doc));
    return map;
  }, [documents]);

  const specializationKey = professional.specialization?.key;
  const specializationLabel = specializationKey
    ? t(`lookups.${specializationKey}`)
    : "—";

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
      {/* Professional Info */}
      <SectionHeader
        title={t("professionalProfile.overview.professionalInfo")}
      />
      <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
        <InfoRow
          icon="medical-outline"
          label={t("professionalProfile.overview.specialization")}
          value={specializationLabel}
        />
        <InfoRow
          icon="cash-outline"
          label={t("professionalProfile.overview.visitPrice")}
          value={`$${professional.visitPrice}${t("professionalProfile.overview.pricePerVisit")}`}
        />
        <InfoRow
          icon="briefcase-outline"
          label={t("professionalProfile.overview.experience")}
          value={t("professionalProfile.overview.yearsExp", {
            count: professional.experience,
          })}
        />
        <View className="flex-row items-start gap-3 py-2">
          <View className="w-8 h-8 rounded-lg bg-brand-secondary/8 items-center justify-center mt-0.5">
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#00546e"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-medium tracking-wide uppercase text-brand-secondary/50 mb-1">
              {t("professionalProfile.overview.verificationStatus")}
            </Text>
            <VerificationBadge status={professional.verificationStatus} />
          </View>
        </View>
      </View>

      {/* Services */}
      <SectionHeader title={t("professionalProfile.overview.services")} />
      <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
        {(professional.services ?? []).length === 0 ? (
          <Text className="text-sm text-brand-secondary/50 italic">
            {t("professionalProfile.overview.noServices")}
          </Text>
        ) : (
          <View className="flex-row flex-wrap gap-1.5">
            {professional.services.map((service) => (
              <View
                key={service.id}
                className="border border-brand-secondary/15 rounded-full px-2.5 py-1 bg-brand-bg"
              >
                <Text className="text-xs text-brand-secondary">
                  {t(service.key)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Contact Information */}
      <SectionHeader title={t("professionalProfile.overview.contactInfo")} />
      <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
        {addressParts.length > 0 && (
          <InfoRow
            icon="location-outline"
            label={t("professionalProfile.overview.address")}
            value={addressParts.join(", ")}
          />
        )}
        <InfoRow
          icon="mail-outline"
          label={t("professionalProfile.overview.email")}
          value={professional.email}
        />
        <InfoRow
          icon="call-outline"
          label={t("professionalProfile.overview.phone")}
          value={professional.phoneNumber}
        />
        <InfoRow
          icon="calendar-outline"
          label={t("professionalProfile.overview.dob")}
          value={`${formatDob(professional.dateOfBirth)} · ${calcAge(professional.dateOfBirth)} yrs`}
        />
      </View>

      {isLoadingExtras ? (
        <View className="items-center py-6">
          <ActivityIndicator size="small" color="#00546e" />
        </View>
      ) : (
        <>
          {/* Credentials */}
          <SectionHeader
            title={t("professionalProfile.overview.credentials")}
          />
          <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4 gap-3">
            {DOCUMENT_TYPES.map((docType, idx) => {
              const doc = documentMap.get(docType);
              const status = doc?.status ?? "NotUploaded";
              return (
                <React.Fragment key={docType}>
                  {idx > 0 && <View className="h-px bg-brand-secondary/8" />}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2 flex-1">
                      <View className="w-7 h-7 rounded-lg bg-brand-secondary/8 items-center justify-center">
                        <Ionicons
                          name="document-text-outline"
                          size={14}
                          color="#00546e"
                        />
                      </View>
                      <Text className="text-sm font-medium text-brand-dark flex-1">
                        {t(
                          `professionalProfile.overview.docTypes.${docType}`,
                          docType,
                        )}
                      </Text>
                    </View>
                    <DocumentStatusChip status={status} />
                  </View>
                </React.Fragment>
              );
            })}
          </View>

          {/* Experience */}
          <SectionHeader title={t("professionalProfile.overview.experience")} />
          <View className="mb-4">
            {experiences.length === 0 ? (
              <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4">
                <Text className="text-sm text-brand-secondary/50 italic">
                  {t("professionalProfile.overview.noExperience")}
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {experiences.map((exp) => (
                  <View
                    key={exp.id}
                    className="bg-white rounded-2xl border border-brand-secondary/10 p-4"
                  >
                    <Text className="text-sm font-semibold text-brand-dark">
                      {exp.title}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5 mb-1">
                      <Ionicons
                        name="business-outline"
                        size={12}
                        color="rgba(0,84,110,0.5)"
                      />
                      <Text className="text-xs text-brand-secondary/70">
                        {exp.organization}
                      </Text>
                      {exp.location ? (
                        <>
                          <Text className="text-xs text-brand-secondary/40">
                            ·
                          </Text>
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color="rgba(0,84,110,0.4)"
                          />
                          <Text className="text-xs text-brand-secondary/60">
                            {exp.location}
                          </Text>
                        </>
                      ) : null}
                    </View>
                    <Text className="text-[11px] text-brand-secondary/50 mb-1">
                      {exp.startYear} –{" "}
                      {exp.isCurrentPosition
                        ? t("professionalProfile.overview.present")
                        : (exp.endYear ?? "")}
                    </Text>
                    {exp.description ? (
                      <Text className="text-xs text-brand-secondary/70 leading-relaxed">
                        {exp.description}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Education */}
          <SectionHeader title={t("professionalProfile.overview.education")} />
          <View className="mb-4">
            {educations.length === 0 ? (
              <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4">
                <Text className="text-sm text-brand-secondary/50 italic">
                  {t("professionalProfile.overview.noEducation")}
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {educations.map((edu) => {
                  const eduCountryKey = countries.find(
                    (c) => c.id === edu.countryId,
                  )?.key;
                  return (
                    <View
                      key={edu.id}
                      className="bg-white rounded-2xl border border-brand-secondary/10 p-4"
                    >
                      <Text className="text-sm font-semibold text-brand-dark">
                        {edu.degree}
                        {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5 mb-1">
                        <Ionicons
                          name="school-outline"
                          size={12}
                          color="rgba(0,84,110,0.5)"
                        />
                        <Text className="text-xs text-brand-secondary/70">
                          {edu.institution}
                        </Text>
                        {eduCountryKey ? (
                          <>
                            <Text className="text-xs text-brand-secondary/40">
                              ·
                            </Text>
                            <Text className="text-xs text-brand-secondary/60">
                              {t(
                                `lookups.countries.${eduCountryKey}`,
                                eduCountryKey,
                              )}
                            </Text>
                          </>
                        ) : null}
                      </View>
                      <Text className="text-[11px] text-brand-secondary/50 mb-1">
                        {edu.startYear} –{" "}
                        {edu.isCurrentlyStudying
                          ? t("professionalProfile.overview.present")
                          : (edu.endYear ?? "")}
                      </Text>
                      {edu.description ? (
                        <Text className="text-xs text-brand-secondary/70 leading-relaxed">
                          {edu.description}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Awards */}
          <SectionHeader title={t("professionalProfile.overview.awards")} />
          <View className="mb-4">
            {awards.length === 0 ? (
              <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4">
                <Text className="text-sm text-brand-secondary/50 italic">
                  {t("professionalProfile.overview.noAwards")}
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {awards.map((award) => (
                  <View
                    key={award.id}
                    className="bg-white rounded-2xl border border-brand-secondary/10 p-4"
                  >
                    <View className="flex-row items-start gap-2">
                      <View className="w-8 h-8 rounded-lg bg-brand-cream/30 items-center justify-center mt-0.5">
                        <Ionicons
                          name="trophy-outline"
                          size={15}
                          color="#00394a"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-brand-dark">
                          {award.title}
                        </Text>
                        {award.issuer ? (
                          <Text className="text-xs text-brand-secondary/70 mt-0.5">
                            {award.issuer}
                          </Text>
                        ) : null}
                        <Text className="text-[11px] text-brand-secondary/50 mt-0.5">
                          {award.yearReceived}
                        </Text>
                        {award.description ? (
                          <Text className="text-xs text-brand-secondary/70 leading-relaxed mt-1">
                            {award.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ─── Schedule Tab (read-only) ─────────────────────────────────────────────────

function ScheduleTab({ professionalId }: { professionalId: string }) {
  const { t } = useTranslation();
  const { data: scheduleData, isLoading } = useGetSchedule(professionalId);

  const days = useMemo(
    () => (scheduleData ? mergeWithAllDays(scheduleData.days) : null),
    [scheduleData],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

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
      <SectionHeader title={t("professionalProfile.schedule.title")} />
      {days === null ? (
        <View className="bg-white rounded-2xl border border-brand-secondary/10 p-6 items-center gap-2">
          <Ionicons
            name="calendar-outline"
            size={36}
            color="rgba(0,84,110,0.2)"
          />
          <Text className="text-base font-semibold text-brand-dark">
            {t("professionalProfile.schedule.title")}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {DISPLAY_ORDER.map((dayOfWeek) => {
            const dayData = days.find((d) => d.dayOfWeek === dayOfWeek);
            if (!dayData) return null;
            const dayName = t(
              `professional.schedule.days.${DAY_KEYS[dayData.dayOfWeek] ?? "monday"}`,
            );
            return (
              <View
                key={dayOfWeek}
                className="bg-white rounded-2xl border border-brand-secondary/10 overflow-hidden"
                style={{
                  shadowColor: "#00222e",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 1,
                }}
              >
                {/* Day header */}
                <View className="flex-row items-center px-4 py-3.5 gap-3">
                  <Text className="flex-1 text-sm font-semibold text-brand-dark">
                    {dayName}
                  </Text>
                  {dayData.isActive ? (
                    <View className="flex-row items-center gap-1.5 rounded-full bg-brand-teal/10 px-2.5 py-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      <Text className="text-xs font-semibold text-brand-dark">
                        {t("professionalProfile.schedule.available")}
                      </Text>
                    </View>
                  ) : (
                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: "rgba(0,84,110,0.45)" }}
                      >
                        {t("professionalProfile.schedule.unavailable")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Slots */}
                {dayData.isActive && dayData.availabilitySlots.length > 0 && (
                  <View className="px-4 pb-3.5 gap-2">
                    <View className="h-px bg-brand-secondary/8 mb-1" />
                    <View className="flex-row flex-wrap gap-2">
                      {dayData.availabilitySlots.map((slot, idx) => (
                        <View
                          key={slot.id ?? `slot-${idx}`}
                          className="flex-row items-center gap-1.5 rounded-xl px-3 py-1.5"
                          style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
                        >
                          <Text className="text-xs font-semibold text-brand-dark">
                            {slot.startTime}
                          </Text>
                          <Text className="text-xs text-brand-secondary/40">
                            →
                          </Text>
                          <Text className="text-xs font-semibold text-brand-dark">
                            {slot.endTime}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

interface ReviewsTabProps {
  professionalId: string;
  currentUserId?: string;
  currentPatientId?: string;
  isPatient: boolean;
  isAdmin: boolean;
}

function ReviewsTab({
  professionalId,
  currentUserId,
  currentPatientId,
  isPatient,
  isAdmin,
}: ReviewsTabProps) {
  const { t } = useTranslation();

  const { data: statsData } = useGetProfessionalReviewStats(professionalId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useGetProfessionalReviews(professionalId);

  const reviews = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  // Find current patient's existing review for edit
  const myReview = useMemo(
    () =>
      currentPatientId
        ? reviews.find((r) => r.author.id === currentPatientId)
        : undefined,
    [reviews, currentPatientId],
  );

  const submitMutation = useSubmitProfessionalReview(professionalId);
  const updateMutation = useUpdateReview(professionalId);
  const deleteMutation = useDeleteReview(professionalId);
  const likeMutation = useToggleReviewLike(professionalId);
  const replyMutation = useReplyToReview(professionalId);
  const editReplyMutation = useEditReply(professionalId);
  const deleteReplyMutation = useDeleteReply(professionalId);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetReplyId, setDeleteTargetReplyId] = useState<string | null>(
    null,
  );
  const [deleteTargetReplyReviewId, setDeleteTargetReplyReviewId] = useState<
    string | null
  >(null);

  const handleSubmitReview = useCallback(
    (comment: string, rating: number) => {
      if (!currentPatientId) return;
      submitMutation.mutate(
        { professionalId, comment, rating },
        {
          onError: () => {
            Toast.show({ type: "error", text1: t("errors.unexpected") });
          },
        },
      );
    },
    [currentPatientId, professionalId, submitMutation, t],
  );

  const handleEdit = useCallback(
    (reviewId: string, comment: string, rating: number) => {
      updateMutation.mutate(
        { reviewId, data: { comment, rating } },
        {
          onError: () => {
            Toast.show({ type: "error", text1: t("errors.unexpected") });
          },
        },
      );
    },
    [updateMutation, t],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
      onError: () => {
        setDeleteTargetId(null);
        Toast.show({ type: "error", text1: t("errors.unexpected") });
      },
    });
  }, [deleteTargetId, deleteMutation, t]);

  const handleLike = useCallback(
    (reviewId: string, isLiked: boolean) => {
      likeMutation.mutate({ reviewId, isLiked });
    },
    [likeMutation],
  );

  const handleReply = useCallback(
    (reviewId: string, comment: string) => {
      replyMutation.mutate(
        { reviewId, data: { comment } },
        {
          onError: () => {
            Toast.show({ type: "error", text1: t("errors.unexpected") });
          },
        },
      );
    },
    [replyMutation, t],
  );

  const handleEditReply = useCallback(
    (reviewId: string, replyId: string, comment: string) => {
      editReplyMutation.mutate(
        { reviewId, replyId, patientId: professionalId, data: { comment } },
        {
          onError: () => {
            Toast.show({ type: "error", text1: t("errors.unexpected") });
          },
        },
      );
    },
    [editReplyMutation, professionalId, t],
  );

  const handleDeleteReply = useCallback((reviewId: string, replyId: string) => {
    setDeleteTargetReplyReviewId(reviewId);
    setDeleteTargetReplyId(replyId);
  }, []);

  const handleConfirmDeleteReply = useCallback(() => {
    if (!deleteTargetReplyId || !deleteTargetReplyReviewId) return;
    deleteReplyMutation.mutate(
      { reviewId: deleteTargetReplyReviewId, replyId: deleteTargetReplyId },
      {
        onSuccess: () => {
          setDeleteTargetReplyId(null);
          setDeleteTargetReplyReviewId(null);
        },
        onError: () => {
          setDeleteTargetReplyId(null);
          setDeleteTargetReplyReviewId(null);
          Toast.show({ type: "error", text1: t("errors.unexpected") });
        },
      },
    );
  }, [deleteTargetReplyId, deleteTargetReplyReviewId, deleteReplyMutation, t]);

  const renderItem = useCallback(
    ({ item }: { item: ReviewDto }) => (
      <PatientReviewCard
        review={item}
        currentProfessionalId={currentPatientId}
        currentUserId={currentUserId}
        isPatient={isPatient}
        isAdmin={isAdmin}
        onLike={handleLike}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteTargetId(id)}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        isLikeLoading={
          likeMutation.isPending && likeMutation.variables?.reviewId === item.id
        }
        isReplyLoading={
          replyMutation.isPending &&
          replyMutation.variables?.reviewId === item.id
        }
        editingReplyId={
          editReplyMutation.isPending
            ? (editReplyMutation.variables?.replyId ?? null)
            : null
        }
        deletingReplyId={
          deleteReplyMutation.isPending
            ? (deleteReplyMutation.variables?.replyId ?? null)
            : null
        }
      />
    ),
    [
      currentUserId,
      currentPatientId,
      isPatient,
      isAdmin,
      handleLike,
      handleReply,
      handleEdit,
      handleEditReply,
      handleDeleteReply,
      likeMutation,
      replyMutation,
      editReplyMutation,
      deleteReplyMutation,
    ],
  );

  const renderFooter = useCallback(
    () =>
      hasNextPage ? (
        <View className="items-center py-4">
          {isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#00546e" />
          ) : (
            <Pressable
              className="px-4 py-2 rounded-full border border-brand-secondary/20"
              onPress={() => fetchNextPage()}
              accessibilityRole="button"
            >
              <Text className="text-xs text-brand-secondary">
                {t("professionalProfile.reviews.loadMore")}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null,
    [hasNextPage, isFetchingNextPage, fetchNextPage, t],
  );

  const listHeader = useMemo(
    () => (
      <View>
        {/* Stats */}
        {statsData && statsData.totalCount > 0 && (
          <ReviewStatsHeader
            averageRating={statsData.averageRating}
            totalCount={statsData.totalCount}
          />
        )}

        {/* Add / Edit review form (patient only, hasn't reviewed yet) */}
        {isPatient && !myReview && (
          <AddPatientReviewForm
            onSubmit={handleSubmitReview}
            isLoading={submitMutation.isPending}
          />
        )}

        {reviews.length === 0 && !isLoading && (
          <View className="items-center py-10 gap-2">
            <Ionicons
              name="chatbubble-outline"
              size={36}
              color="rgba(0,84,110,0.2)"
            />
            <Text className="text-base font-semibold text-brand-dark">
              {t("professionalProfile.reviews.noReviews")}
            </Text>
            <Text className="text-sm text-brand-secondary/60 text-center">
              {t("professionalProfile.reviews.noReviewsDesc")}
            </Text>
          </View>
        )}
      </View>
    ),
    [
      statsData,
      isPatient,
      myReview,
      handleSubmitReview,
      submitMutation.isPending,
      reviews.length,
      isLoading,
      t,
    ],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#00546e"
          />
        }
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
        onEndReachedThreshold={0.3}
      />

      {/* Delete review confirm dialog */}
      <ConfirmDialog
        visible={deleteTargetId !== null}
        title={t("professionalProfile.reviews.deleteReview")}
        subtitle={t("professionalProfile.reviews.confirmDelete")}
        confirmLabel={t("professionalProfile.reviews.deleteReview")}
        dismissLabel={t("common.cancel")}
        onConfirm={handleConfirmDelete}
        onDismiss={() => setDeleteTargetId(null)}
        destructive
        isLoading={deleteMutation.isPending}
      />
      {/* Delete reply confirm dialog */}
      <ConfirmDialog
        visible={deleteTargetReplyId !== null}
        title={t("professionalProfile.reviews.deleteReview")}
        subtitle={t("professionalProfile.reviews.confirmDelete")}
        confirmLabel={t("professionalProfile.reviews.deleteReview")}
        dismissLabel={t("common.cancel")}
        onConfirm={handleConfirmDeleteReply}
        onDismiss={() => {
          setDeleteTargetReplyId(null);
          setDeleteTargetReplyReviewId(null);
        }}
        destructive
        isLoading={deleteReplyMutation.isPending}
      />
    </>
  );
}

// ─── Main Professional Profile Screen ────────────────────────────────────────

export interface ProfessionalProfileScreenProps {
  /** Professional ID to view */
  professionalId: string;
  /** Called when the back button is pressed */
  onBack?: () => void;
}

export function ProfessionalProfileScreen({
  professionalId,
  onBack,
}: ProfessionalProfileScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Fade animation for tab content transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { data: currentUser } = useCurrentUser();
  const viewerRole = currentUser?.role ?? "Patient";
  const isPatientViewer = viewerRole === "Patient";
  const isAdminViewer = viewerRole === "Admin";

  // Fetch current patient (for review authoring when viewer is a patient)
  const { data: currentPatient } = useGetCurrentPatient();

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
          <OverviewTab
            professional={professional}
            educations={educations}
            experiences={experiences}
            awards={awards}
            documents={documents}
            isLoadingExtras={isLoadingExtras}
          />
        ) : activeTab === "schedule" ? (
          <ScheduleTab professionalId={professionalId} />
        ) : (
          <ReviewsTab
            professionalId={professionalId}
            currentUserId={currentUser?.id}
            currentPatientId={isPatientViewer ? currentPatient?.id : undefined}
            isPatient={isPatientViewer}
            isAdmin={isAdminViewer || viewerRole === "Professional"}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
