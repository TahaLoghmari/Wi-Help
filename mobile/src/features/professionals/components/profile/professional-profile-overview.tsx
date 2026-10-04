import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useGetCountries, useGetStatesByCountry } from "@/shared/api/location";
import type {
  DocumentType,
  FullProfessionalDto,
  ProfessionalAwardDto,
  ProfessionalDocumentDto,
  ProfessionalEducationDto,
  ProfessionalExperienceDto,
} from "@/features/professionals/api";

function calcAge(dob: string, now: Date): number {
  const birth = new Date(dob);
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

interface ProfessionalProfileOverviewProps {
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

export function ProfessionalProfileOverview({
  professional,
  educations,
  experiences,
  awards,
  documents,
  isLoadingExtras,
}: ProfessionalProfileOverviewProps) {
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
          value={`${formatDob(professional.dateOfBirth)} · ${calcAge(professional.dateOfBirth, new Date())} yrs`}
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
