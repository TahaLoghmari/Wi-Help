import {
  Calendar,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  ShieldCheck,
  Stethoscope,
  DollarSign,
  Layers,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  BookOpen,
  Award,
  Trophy,
  FileBadge,
  IdCard,
  Shield,
  CalendarDays,
} from "lucide-react";
import {
  getServicesForSpecialization,
  GetCurrentProfessional,
  useGetEducations,
  useGetExperiences,
  useGetAwards,
  GetVerificationDocuments,
  GetSchedule,
  DocumentType,
  DocumentStatus,
  DAYS,
  type GetEducationsDto,
  type GetExperiencesDto,
  type GetAwardsDto,
  type VerificationDocumentDto,
} from "@/features/professional";
import { VerificationStatus } from "@/features/admin/types/adminTypes";
import { COUNTRIES, SPECIALIZATIONS } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage, Spinner } from "@/components";
import { ReviewsList, GetProfessionalReviewStats } from "@/features/reviews";
import { Medal } from "lucide-react";
import { useMemo, useState } from "react";

type TabType = "overview" | "reviews" | "schedule";

// Experience Card Component
function ExperienceCard({ experience }: { experience: GetExperiencesDto }) {
  const yearRange = experience.isCurrentPosition
    ? `${experience.startYear} – Present`
    : `${experience.startYear} – ${experience.endYear}`;

  return (
    <article className="group border-brand-dark/10 bg-brand-bg hover:border-brand-dark/20 rounded-xl border p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="bg-brand-dark/10 text-brand-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-brand-dark text-sm font-semibold">
              {experience.title}
            </h4>
            <div className="text-brand-secondary mt-0.5 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {experience.organization}
              </span>
              {experience.location && (
                <>
                  <span className="text-brand-dark/20">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {experience.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <span className="text-brand-dark shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium">
          {yearRange}
        </span>
      </div>
      {experience.description && (
        <p className="text-brand-secondary mt-3 text-xs leading-relaxed">
          {experience.description}
        </p>
      )}
    </article>
  );
}

// Education Card Component
function EducationCard({ education }: { education: GetEducationsDto }) {
  const yearRange = education.isCurrentlyStudying
    ? `${education.startYear} – Present`
    : `${education.startYear} – ${education.endYear}`;

  return (
    <article className="group border-brand-dark/10 bg-brand-bg hover:border-brand-dark/20 rounded-xl border p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="bg-brand-dark/10 text-brand-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-brand-dark text-sm font-semibold">
              {education.degree}
            </h4>
            <p className="text-brand-secondary mt-0.5 text-xs font-medium">
              {education.institution}
            </p>
          </div>
        </div>
        <span className="text-brand-dark shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium">
          {yearRange}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {education.fieldOfStudy && (
          <span className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]">
            <BookOpen className="text-brand-dark h-3 w-3" />
            {education.fieldOfStudy}
          </span>
        )}
        {education.country && (
          <span className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]">
            <MapPin className="text-brand-dark h-3 w-3" />
            {education.country}
          </span>
        )}
      </div>
    </article>
  );
}

// Award Card Component
function AwardCard({ award }: { award: GetAwardsDto }) {
  return (
    <article className="group border-brand-dark/10 bg-brand-bg hover:border-brand-dark/20 rounded-xl border p-4 transition-all">
      <div className="flex items-start gap-3">
        <div className="bg-brand-dark/10 text-brand-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-brand-dark text-sm font-semibold">
                {award.title}
              </h4>
              {award.issuer && (
                <p className="text-brand-secondary mt-0.5 flex items-center gap-1 text-xs">
                  <Award className="h-3 w-3" />
                  {award.issuer}
                </p>
              )}
            </div>
            <span className="text-brand-dark shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium">
              {award.yearReceived}
            </span>
          </div>
          {award.description && (
            <p className="text-brand-secondary mt-2 text-xs leading-relaxed">
              {award.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProfileLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { data: professional, isLoading, isError } = GetCurrentProfessional();
  const { data: reviewStats } = GetProfessionalReviewStats(
    professional?.id ?? "",
  );
  const { data: educations, isLoading: isLoadingEducations } =
    useGetEducations();
  const { data: experiences, isLoading: isLoadingExperiences } =
    useGetExperiences();
  const { data: awards, isLoading: isLoadingAwards } = useGetAwards();
  const { data: verificationDocuments, isLoading: isLoadingDocuments } =
    GetVerificationDocuments();
  const { data: schedule, isLoading: isLoadingSchedule } = GetSchedule(
    professional?.id!,
  );

  // Map documents by type for easy lookup
  const documentsByType = useMemo((): Partial<
    Record<DocumentType, VerificationDocumentDto>
  > => {
    if (!verificationDocuments) return {};
    return verificationDocuments.reduce(
      (acc, doc) => {
        acc[doc.type] = doc;
        return acc;
      },
      {} as Partial<Record<DocumentType, VerificationDocumentDto>>,
    );
  }, [verificationDocuments]);

  // Count verified documents
  const verifiedCount = useMemo(() => {
    if (!verificationDocuments) return 0;
    return verificationDocuments.filter(
      (doc) => doc.status === DocumentStatus.Verified,
    ).length;
  }, [verificationDocuments]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">Error loading profile.</div>
    );
  }

  return (
    <section className="mb-6 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="border-brand-dark/10 relative overflow-hidden rounded-2xl border bg-white">
        {/* Cover / decorative top */}
        <div className="bg-brand-dark relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            {/* Avatar */}
            <div className="relative -mt-12 h-24 w-24 shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white bg-white">
                <AvatarImage
                  className="object-cover"
                  src={professional?.profilePictureUrl}
                  alt={professional?.firstName}
                />
                <AvatarFallback className="rounded-full text-lg">
                  {professional?.firstName && professional?.lastName
                    ? professional.firstName.charAt(0).toUpperCase() +
                      professional.lastName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1 pt-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-brand-dark flex items-center gap-2 text-xl font-bold tracking-tight">
                    Dr. {professional?.firstName} {professional?.lastName}
                    <ShieldCheck className="text-brand-blue fill-brand-blue/10 h-5 w-5" />
                  </h2>
                  <p className="text-brand-secondary text-sm">
                    {
                      SPECIALIZATIONS.find(
                        (s) => s.value === professional?.specialization,
                      )?.label
                    }{" "}
                    Specialist
                  </p>
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                  <User className="text-brand-secondary h-3.5 w-3.5" />
                  <span className="text-brand-dark font-medium">
                    {professional?.gender
                      ? professional.gender.charAt(0).toUpperCase() +
                        professional.gender.slice(1).toLowerCase()
                      : ""}
                  </span>
                </div>
                <div className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                  <span className="text-brand-dark font-semibold">
                    {reviewStats?.averageRating}
                  </span>
                  <span className="text-brand-secondary/70">
                    ({reviewStats?.totalCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200 px-1">
        <div className="flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`profile-tab relative py-3 transition-colors ${
              activeTab === "overview"
                ? "text-brand-dark font-semibold"
                : "hover:text-brand-dark text-slate-500"
            }`}
            data-target="profile-content-overview"
          >
            Overview
            <span
              className={`bg-brand-dark absolute bottom-0 left-0 h-0.5 w-full ${
                activeTab === "overview" ? "" : "hidden"
              }`}
            ></span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`profile-tab relative py-3 transition-colors ${
              activeTab === "reviews"
                ? "text-brand-dark font-semibold"
                : "hover:text-brand-dark text-slate-500"
            }`}
            data-target="profile-content-reviews"
          >
            Reviews
            <span
              className={`bg-brand-dark absolute bottom-0 left-0 h-0.5 w-full ${
                activeTab === "reviews" ? "" : "hidden"
              }`}
            ></span>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`profile-tab relative py-3 transition-colors ${
              activeTab === "schedule"
                ? "text-brand-dark font-semibold"
                : "hover:text-brand-dark text-slate-500"
            }`}
            data-target="profile-content-schedule"
          >
            Schedule
            <span
              className={`bg-brand-dark absolute bottom-0 left-0 h-0.5 w-full ${
                activeTab === "schedule" ? "" : "hidden"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Left Column (Main) */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
              <h3 className="text-brand-dark mb-4 flex items-center gap-2 text-sm font-bold tracking-tight">
                <User className="text-brand-secondary h-4 w-4" />
                About &amp; Bio
              </h3>
              <div className="prose prose-sm text-brand-secondary mb-6 max-w-none text-xs leading-relaxed">
                {professional?.bio}
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                  <div className="text-brand-dark rounded-full border bg-white p-2">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                    Specialty
                  </div>
                  <div className="text-brand-dark text-xs font-semibold">
                    {
                      SPECIALIZATIONS.find(
                        (s) => s.value === professional?.specialization,
                      )?.label
                    }
                  </div>
                </div>
                <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                  <div className="text-brand-dark rounded-full border bg-white p-2">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                    Rate
                  </div>
                  <div className="text-brand-dark text-xs font-semibold">
                    ${professional?.startPrice} - ${professional?.endPrice}/hr
                  </div>
                </div>
                <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                  <div className="text-brand-dark rounded-full border bg-white p-2">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                    Experience
                  </div>
                  <div className="text-brand-dark text-xs font-semibold">
                    {professional?.experience} Years
                  </div>
                </div>
                {(() => {
                  const status = professional?.verificationStatus;
                  let statusColor = "text-gray-500";
                  let StatusIcon = Shield;
                  let statusLabel = "Unknown";

                  if (status === VerificationStatus.Verified) {
                    statusColor = "text-brand-teal";
                    StatusIcon = ShieldCheck;
                    statusLabel = "Verified";
                  } else if (status === VerificationStatus.Pending) {
                    statusColor = "text-brand-dark";
                    StatusIcon = Clock;
                    statusLabel = "Pending";
                  } else if (status === VerificationStatus.Rejected) {
                    statusColor = "text-red-500";
                    StatusIcon = XCircle;
                    statusLabel = "Rejected";
                  }

                  return (
                    <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                      <div
                        className={`${statusColor} rounded-full border p-2 ${status === VerificationStatus.Pending ? "border-brand-cream/50 bg-brand-cream/50" : "bg-white"}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                        Status
                      </div>
                      <div className={`${statusColor} text-xs font-semibold`}>
                        {statusLabel}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* Specialties */}
            <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
              <h3 className="text-brand-dark mb-4 flex items-center gap-2 text-sm font-bold tracking-tight">
                <Layers className="text-brand-secondary h-4 w-4" />
                Specialties &amp; Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {professional?.services?.map((service, index) => (
                  <span
                    key={index}
                    className="border-brand-dark/10 bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10 cursor-default rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    {
                      getServicesForSpecialization(
                        professional.specialization,
                      ).find((s) => s.value === service)?.label
                    }
                  </span>
                ))}
              </div>
            </section>

            {/* Work Experience Section */}
            <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-brand-dark flex items-center gap-2 text-sm font-bold tracking-tight">
                  <Briefcase className="text-brand-secondary h-4 w-4" />
                  Experience
                </h3>
              </div>

              {isLoadingExperiences ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : experiences && experiences.length > 0 ? (
                <div className="space-y-3">
                  {experiences.map((experience) => (
                    <ExperienceCard
                      key={`exp-${experience.id}`}
                      experience={experience}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-brand-dark/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <Briefcase className="text-brand-dark/20 mb-2 h-8 w-8" />
                  <p className="text-xs text-slate-400">
                    No work experience added yet
                  </p>
                </div>
              )}
            </section>

            {/* Education Section */}
            <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-brand-dark flex items-center gap-2 text-sm font-bold tracking-tight">
                  <GraduationCap className="text-brand-secondary h-4 w-4" />
                  Education
                </h3>
              </div>

              {isLoadingEducations ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : educations && educations.length > 0 ? (
                <div className="space-y-3">
                  {educations.map((education) => (
                    <EducationCard
                      key={`edu-${education.id}`}
                      education={education}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-brand-dark/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <GraduationCap className="text-brand-dark/20 mb-2 h-8 w-8" />
                  <p className="text-xs text-slate-400">
                    No education details added yet
                  </p>
                </div>
              )}
            </section>

            {/* Awards Section */}
            <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-brand-dark flex items-center gap-2 text-sm font-bold tracking-tight">
                  <Medal className="text-brand-secondary h-4 w-4" />
                  Awards &amp; Recognitions
                </h3>
              </div>

              {isLoadingAwards ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : awards && awards.length > 0 ? (
                <div className="space-y-3">
                  {awards.map((award) => (
                    <AwardCard key={`award-${award.id}`} award={award} />
                  ))}
                </div>
              ) : (
                <div className="border-brand-dark/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <Medal className="text-brand-dark/20 mb-2 h-8 w-8" />
                  <p className="text-xs text-slate-400">
                    No awards or recognitions added yet
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Contact Info */}
            <section className="border-brand-dark/10 overflow-hidden rounded-2xl border bg-white">
              <div className="border-brand-dark/10 bg-brand-bg border-b px-5 py-3">
                <h3 className="text-brand-dark text-xs font-bold tracking-tight">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-5 p-5">
                <div className="flex gap-3">
                  <div className="text-brand-secondary mt-0.5 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-brand-dark text-xs font-semibold">
                      Address
                    </div>
                    <div className="text-brand-secondary mt-0.5 text-xs leading-snug">
                      {professional?.address.street}
                      <br />
                      {professional?.address.city},{" "}
                      {professional?.address.state}{" "}
                      {professional?.address.postalCode}
                      <br />
                      {COUNTRIES.find(
                        (c) => c.value === professional?.address?.country,
                      )?.label ?? professional?.address?.country}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-brand-secondary mt-0.5 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-brand-dark text-xs font-semibold">
                      Email
                    </div>
                    <span className="text-brand-blue mt-0.5 block text-xs hover:underline">
                      {professional?.email}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-brand-secondary mt-0.5 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-brand-dark text-xs font-semibold">
                      Phone
                    </div>
                    <div className="text-brand-secondary mt-0.5 text-xs">
                      +216 {professional?.phoneNumber}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-brand-secondary mt-0.5 shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-brand-dark text-xs font-semibold">
                      Date of Birth
                    </div>
                    <div className="text-brand-secondary mt-0.5 text-xs">
                      {professional?.dateOfBirth}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents / Verification */}
            <section className="border-brand-dark/10 overflow-hidden rounded-2xl border bg-white">
              <div className="border-brand-dark/10 bg-brand-bg flex items-center justify-between border-b px-5 py-3">
                <h3 className="text-brand-dark text-xs font-bold tracking-tight">
                  Credentials
                </h3>
                {verifiedCount > 0 && (
                  <span className="border-brand-teal/20 bg-brand-teal/10 text-brand-teal rounded-full border px-2 py-0.5 text-[10px] font-medium">
                    {verifiedCount} verified
                  </span>
                )}
              </div>
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : (
                <div className="divide-brand-dark/5 divide-y">
                  {/* Diploma */}
                  {(() => {
                    const doc = documentsByType[DocumentType.Diploma];
                    const isVerified = doc?.status === DocumentStatus.Verified;
                    const isPending = doc?.status === DocumentStatus.Pending;
                    const isRejected = doc?.status === DocumentStatus.Rejected;

                    return (
                      <div className="group hover:bg-brand-bg flex items-center justify-between p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-2 transition-colors ${
                              isVerified
                                ? "bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal/20"
                                : isPending
                                  ? "bg-brand-cream/50 text-brand-dark group-hover:bg-brand-cream"
                                  : isRejected
                                    ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200"
                                    : "bg-brand-dark/5 text-brand-secondary/40 group-hover:bg-brand-dark/10"
                            }`}
                          >
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-brand-dark text-xs font-medium">
                              Diploma
                            </div>
                            <div className="text-brand-secondary text-[10px]">
                              {isVerified
                                ? "Medical Degree Verified"
                                : isPending
                                  ? "Pending Review"
                                  : isRejected
                                    ? "Requires Attention"
                                    : "Not Uploaded"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            isVerified
                              ? "text-brand-teal"
                              : isPending
                                ? "text-brand-secondary/40"
                                : isRejected
                                  ? "text-rose-500"
                                  : "text-brand-secondary/20"
                          }
                          title={
                            isVerified
                              ? "Verified"
                              : isPending
                                ? "Pending"
                                : isRejected
                                  ? "Rejected"
                                  : "Not Uploaded"
                          }
                        >
                          {isVerified ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isPending ? (
                            <Clock className="h-4 w-4" />
                          ) : isRejected ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Professional License */}
                  {(() => {
                    const doc =
                      documentsByType[DocumentType.ProfessionalLicense];
                    const isVerified = doc?.status === DocumentStatus.Verified;
                    const isPending = doc?.status === DocumentStatus.Pending;
                    const isRejected = doc?.status === DocumentStatus.Rejected;

                    return (
                      <div className="group hover:bg-brand-bg flex items-center justify-between p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-2 transition-colors ${
                              isVerified
                                ? "bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal/20"
                                : isPending
                                  ? "bg-brand-cream/50 text-brand-dark group-hover:bg-brand-cream"
                                  : isRejected
                                    ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200"
                                    : "bg-brand-dark/5 text-brand-secondary/40 group-hover:bg-brand-dark/10"
                            }`}
                          >
                            <FileBadge className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-brand-dark text-xs font-medium">
                              Professional License
                            </div>
                            <div className="text-brand-secondary text-[10px]">
                              {isVerified
                                ? "License Verified"
                                : isPending
                                  ? "Pending Review"
                                  : isRejected
                                    ? "Requires Attention"
                                    : "Not Uploaded"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            isVerified
                              ? "text-brand-teal"
                              : isPending
                                ? "text-brand-secondary/40"
                                : isRejected
                                  ? "text-rose-500"
                                  : "text-brand-secondary/20"
                          }
                          title={
                            isVerified
                              ? "Verified"
                              : isPending
                                ? "Pending"
                                : isRejected
                                  ? "Rejected"
                                  : "Not Uploaded"
                          }
                        >
                          {isVerified ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isPending ? (
                            <Clock className="h-4 w-4" />
                          ) : isRejected ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ID Card */}
                  {(() => {
                    const doc = documentsByType[DocumentType.Id];
                    const isVerified = doc?.status === DocumentStatus.Verified;
                    const isPending = doc?.status === DocumentStatus.Pending;
                    const isRejected = doc?.status === DocumentStatus.Rejected;

                    return (
                      <div className="group hover:bg-brand-bg flex items-center justify-between p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-2 transition-colors ${
                              isVerified
                                ? "bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal/20"
                                : isPending
                                  ? "bg-brand-cream/50 text-brand-dark group-hover:bg-brand-cream"
                                  : isRejected
                                    ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200"
                                    : "bg-brand-dark/5 text-brand-secondary/40 group-hover:bg-brand-dark/10"
                            }`}
                          >
                            <IdCard className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-brand-dark text-xs font-medium">
                              ID Card
                            </div>
                            <div className="text-brand-secondary text-[10px]">
                              {isVerified
                                ? "ID Verified"
                                : isPending
                                  ? "Pending Review"
                                  : isRejected
                                    ? "Requires Attention"
                                    : "Not Uploaded"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            isVerified
                              ? "text-brand-teal"
                              : isPending
                                ? "text-brand-secondary/40"
                                : isRejected
                                  ? "text-rose-500"
                                  : "text-brand-secondary/20"
                          }
                          title={
                            isVerified
                              ? "Verified"
                              : isPending
                                ? "Pending"
                                : isRejected
                                  ? "Rejected"
                                  : "Not Uploaded"
                          }
                        >
                          {isVerified ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isPending ? (
                            <Clock className="h-4 w-4" />
                          ) : isRejected ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Insurance */}
                  {(() => {
                    const doc = documentsByType[DocumentType.Insurance];
                    const isVerified = doc?.status === DocumentStatus.Verified;
                    const isPending = doc?.status === DocumentStatus.Pending;
                    const isRejected = doc?.status === DocumentStatus.Rejected;

                    return (
                      <div className="group hover:bg-brand-bg flex items-center justify-between p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-2 transition-colors ${
                              isVerified
                                ? "bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal/20"
                                : isPending
                                  ? "bg-brand-cream/50 text-brand-dark group-hover:bg-brand-cream"
                                  : isRejected
                                    ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200"
                                    : "bg-brand-dark/5 text-brand-secondary/40 group-hover:bg-brand-dark/10"
                            }`}
                          >
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-brand-dark text-xs font-medium">
                              Liability Insurance
                            </div>
                            <div className="text-brand-secondary text-[10px]">
                              {isVerified
                                ? "Insurance Verified"
                                : isPending
                                  ? "Pending Review"
                                  : isRejected
                                    ? "Requires Attention"
                                    : "Not Uploaded"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            isVerified
                              ? "text-brand-teal"
                              : isPending
                                ? "text-brand-secondary/40"
                                : isRejected
                                  ? "text-rose-500"
                                  : "text-brand-secondary/20"
                          }
                          title={
                            isVerified
                              ? "Verified"
                              : isPending
                                ? "Pending"
                                : isRejected
                                  ? "Rejected"
                                  : "Not Uploaded"
                          }
                        >
                          {isVerified ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isPending ? (
                            <Clock className="h-4 w-4" />
                          ) : isRejected ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {professional?.id && <ReviewsList professionalId={professional.id} />}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
            <h3 className="text-brand-dark mb-6 flex items-center gap-2 text-sm font-bold tracking-tight">
              <CalendarDays className="text-brand-secondary h-4 w-4" />
              Weekly Availability
            </h3>
            {isLoadingSchedule ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-5 w-5" />
              </div>
            ) : schedule?.days && schedule.days.length > 0 ? (
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const daySchedule = schedule.days.find(
                    (d) => d.dayOfWeek === day,
                  );
                  const isActive = daySchedule?.isActive ?? false;
                  const slots = daySchedule?.availabilitySlots ?? [];

                  return (
                    <div
                      key={day}
                      className={`border-brand-dark/10 rounded-xl border p-4 transition-all ${
                        isActive ? "bg-white" : "bg-brand-bg/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-brand-teal/10 text-brand-teal"
                                : "bg-brand-dark/5 text-brand-secondary/40"
                            }`}
                          >
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-brand-dark text-sm font-semibold">
                              {day}
                            </h4>
                            <p className="text-brand-secondary text-xs">
                              {isActive
                                ? `${slots.length} time slot${slots.length !== 1 ? "s" : ""}`
                                : "Not available"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isActive
                              ? "bg-brand-teal/10 text-brand-teal"
                              : "bg-brand-dark/5 text-brand-secondary/60"
                          }`}
                        >
                          {isActive ? "Available" : "Unavailable"}
                        </div>
                      </div>
                      {isActive && slots.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {slots.map((slot, index) => (
                            <span
                              key={slot.id || index}
                              className="border-brand-dark/10 bg-brand-bg text-brand-dark flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                            >
                              <Clock className="text-brand-secondary h-3 w-3" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border-brand-dark/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                <CalendarDays className="text-brand-dark/20 mb-2 h-8 w-8" />
                <p className="text-xs text-slate-400">
                  No schedule configured yet
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
