import { useMemo } from "react";
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
  ArrowLeft,
  Medal,
} from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { COUNTRIES, SPECIALIZATIONS } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage, Spinner } from "@/components/ui";
import {
  GetProfessional,
  getServicesForSpecialization,
  useGetProfessionalEducations,
  useGetProfessionalExperiences,
  useGetProfessionalAwards,
  useGetProfessionalDocuments,
  DocumentType,
  DocumentStatus,
  type GetEducationsDto,
  type GetExperiencesDto,
  type GetAwardsDto,
  type VerificationDocumentDto,
} from "@/features/professional";
import { ReviewsList, GetProfessionalReviewStats } from "@/features/reviews";

// Experience Card Component
function ExperienceCard({ experience }: { experience: GetExperiencesDto }) {
  const yearRange = experience.isCurrentPosition
    ? `${experience.startYear} – Present`
    : `${experience.startYear} – ${experience.endYear}`;

  return (
    <article className="group rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-4 transition-all hover:border-[#00394a]/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00394a]/10 text-[#00394a]">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#00394a]">
              {experience.title}
            </h4>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-[#00546e]">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {experience.organization}
              </span>
              {experience.location && (
                <>
                  <span className="text-[#00394a]/20">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {experience.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#00394a] px-2.5 py-1 text-[10px] font-medium text-[#fbfbfb]">
          {yearRange}
        </span>
      </div>
      {experience.description && (
        <p className="mt-3 text-xs leading-relaxed text-[#00546e]">
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
    <article className="group rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-4 transition-all hover:border-[#00394a]/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00394a]/10 text-[#00394a]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#00394a]">
              {education.degree}
            </h4>
            <p className="mt-0.5 text-xs font-medium text-[#00546e]">
              {education.institution}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#00394a] px-2.5 py-1 text-[10px] font-medium text-[#fbfbfb]">
          {yearRange}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {education.fieldOfStudy && (
          <span className="flex items-center gap-1.5 rounded-full border border-[#00394a]/10 bg-[#fbfbfb] px-2.5 py-1 text-[11px] text-[#00546e]">
            <BookOpen className="h-3 w-3 text-[#00394a]" />
            {education.fieldOfStudy}
          </span>
        )}
        {education.country && (
          <span className="flex items-center gap-1.5 rounded-full border border-[#00394a]/10 bg-[#fbfbfb] px-2.5 py-1 text-[11px] text-[#00546e]">
            <MapPin className="h-3 w-3 text-[#00394a]" />
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
    <article className="group rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-4 transition-all hover:border-[#00394a]/20">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00394a]/10 text-[#00394a]">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-[#00394a]">
                {award.title}
              </h4>
              {award.issuer && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#00546e]">
                  <Award className="h-3 w-3" />
                  {award.issuer}
                </p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-[#00394a] px-2.5 py-1 text-[10px] font-medium text-[#fbfbfb]">
              {award.yearReceived}
            </span>
          </div>
          {award.description && (
            <p className="mt-2 text-xs leading-relaxed text-[#00546e]">
              {award.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

// Document Status Badge Component
function DocumentStatusBadge({
  document,
  Icon,
  title,
  verifiedText,
}: {
  document: VerificationDocumentDto | undefined;
  Icon: React.ElementType;
  title: string;
  verifiedText: string;
}) {
  const isVerified = document?.status === DocumentStatus.Verified;
  const isPending = document?.status === DocumentStatus.Pending;
  const isRejected = document?.status === DocumentStatus.Rejected;

  return (
    <div className="group flex items-center justify-between p-4 transition-colors hover:bg-[#fbfbfb]">
      <div className="flex items-center gap-3">
        <div
          className={`rounded-lg p-2 transition-colors ${
            isVerified
              ? "bg-[#14d3ac]/10 text-[#14d3ac] group-hover:bg-[#14d3ac]/20"
              : isPending
                ? "bg-[#ffecb4]/50 text-[#00394a] group-hover:bg-[#ffecb4]"
                : isRejected
                  ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200"
                  : "bg-[#00394a]/5 text-[#00546e]/40 group-hover:bg-[#00394a]/10"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#00394a]">{title}</div>
          <div className="text-[10px] text-[#00546e]">
            {isVerified
              ? verifiedText
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
            ? "text-[#14d3ac]"
            : isPending
              ? "text-[#00546e]/40"
              : isRejected
                ? "text-rose-500"
                : "text-[#00546e]/20"
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
}

export function ProfessionalProfileView() {
  const router = useRouter();
  const { professionalId } = useParams({ strict: false });

  const {
    data: professional,
    isLoading,
    isError,
  } = GetProfessional({ professionalId: professionalId! });

  const { data: reviewStats } = GetProfessionalReviewStats(professionalId!);

  const { data: educations, isLoading: isLoadingEducations } =
    useGetProfessionalEducations({ professionalId: professionalId! });

  const { data: experiences, isLoading: isLoadingExperiences } =
    useGetProfessionalExperiences({ professionalId: professionalId! });

  const { data: awards, isLoading: isLoadingAwards } =
    useGetProfessionalAwards({ professionalId: professionalId! });

  const { data: verificationDocuments, isLoading: isLoadingDocuments } =
    useGetProfessionalDocuments({ professionalId: professionalId! });

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
      <div className="p-8 text-center text-red-500">
        Error loading professional profile.
      </div>
    );
  }

  return (
    <section className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.history.back()}
        className="group mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to professionals
      </button>

      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Cover / decorative top */}
        <div className="relative h-28 overflow-hidden bg-[#00394a]">
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
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                    Dr. {professional?.firstName} {professional?.lastName}
                    <ShieldCheck className="h-5 w-5 fill-blue-50 text-[#3fa6ff]" />
                  </h2>
                  <p className="text-sm text-slate-500">
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
                <div className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
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
                  <span className="font-semibold text-slate-900">
                    {reviewStats?.averageRating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="text-slate-400">
                    ({reviewStats?.totalCount ?? 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Left Column (Main) */}
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
              <User className="h-4 w-4 text-[#00546e]" />
              About &amp; Bio
            </h3>
            <div className="prose prose-sm mb-6 max-w-none text-xs leading-relaxed text-[#00546e]">
              {professional?.bio}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#00394a]">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00546e]">
                  Specialty
                </div>
                <div className="text-xs font-semibold text-[#00394a]">
                  {
                    SPECIALIZATIONS.find(
                      (s) => s.value === professional?.specialization,
                    )?.label
                  }
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#00394a]">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00546e]">
                  Rate
                </div>
                <div className="text-xs font-semibold text-[#00394a]">
                  ${professional?.startPrice} - ${professional?.endPrice}/hr
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#00394a]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00546e]">
                  Experience
                </div>
                <div className="text-xs font-semibold text-[#00394a]">
                  {professional?.experience} Years
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#14d3ac]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00546e]">
                  Status
                </div>
                <div className="text-xs font-semibold text-[#14d3ac]">
                  Verified
                </div>
              </div>
            </div>
          </section>

          {/* Specialties */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
              <Layers className="h-4 w-4 text-[#00546e]" />
              Specialties &amp; Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {professional?.services.map((service, index) => (
                <span
                  key={index}
                  className="cursor-default rounded-full border border-[#00394a]/10 bg-[#00394a]/5 px-3 py-1.5 text-xs font-medium text-[#00394a] transition-colors hover:bg-[#00394a]/10"
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
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
                <Briefcase className="h-4 w-4 text-[#00546e]" />
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00394a]/20 py-8 text-center">
                <Briefcase className="mb-2 h-8 w-8 text-[#00394a]/20" />
                <p className="text-xs text-slate-400">
                  No work experience added yet
                </p>
              </div>
            )}
          </section>

          {/* Education Section */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
                <GraduationCap className="h-4 w-4 text-[#00546e]" />
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00394a]/20 py-8 text-center">
                <GraduationCap className="mb-2 h-8 w-8 text-[#00394a]/20" />
                <p className="text-xs text-slate-400">
                  No education details added yet
                </p>
              </div>
            )}
          </section>

          {/* Awards Section */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
                <Medal className="h-4 w-4 text-[#00546e]" />
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00394a]/20 py-8 text-center">
                <Medal className="mb-2 h-8 w-8 text-[#00394a]/20" />
                <p className="text-xs text-slate-400">
                  No awards or recognitions added yet
                </p>
              </div>
            )}
          </section>

          {/* Reviews Section - With ability for patients to add reviews and like */}
          {professionalId && <ReviewsList professionalId={professionalId} />}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          {/* Contact Info */}
          <section className="overflow-hidden rounded-2xl border border-[#00394a]/10 bg-white">
            <div className="border-b border-[#00394a]/10 bg-[#fbfbfb] px-5 py-3">
              <h3 className="text-xs font-bold tracking-tight text-[#00394a]">
                Contact Information
              </h3>
            </div>
            <div className="space-y-5 p-5">
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Address
                  </div>
                  <div className="mt-0.5 text-xs leading-snug text-[#00546e]">
                    {professional?.address.street}
                    <br />
                    {professional?.address.city}, {professional?.address.state}{" "}
                    {professional?.address.postalCode}
                    <br />
                    {COUNTRIES.find(
                      (c) => c.value === professional?.address?.country,
                    )?.label ?? professional?.address?.country}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Email
                  </div>
                  <span className="mt-0.5 block text-xs text-[#3fa6ff] hover:underline">
                    {professional?.email}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Phone
                  </div>
                  <div className="mt-0.5 text-xs text-[#00546e]">
                    +216 {professional?.phoneNumber}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Date of Birth
                  </div>
                  <div className="mt-0.5 text-xs text-[#00546e]">
                    {professional?.dateOfBirth}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Documents / Verification */}
          <section className="overflow-hidden rounded-2xl border border-[#00394a]/10 bg-white">
            <div className="flex items-center justify-between border-b border-[#00394a]/10 bg-[#fbfbfb] px-5 py-3">
              <h3 className="text-xs font-bold tracking-tight text-[#00394a]">
                Credentials
              </h3>
              {verifiedCount > 0 && (
                <span className="rounded-full border border-[#14d3ac]/20 bg-[#14d3ac]/10 px-2 py-0.5 text-[10px] font-medium text-[#14d3ac]">
                  {verifiedCount} verified
                </span>
              )}
            </div>
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-5 w-5" />
              </div>
            ) : (
              <div className="divide-y divide-[#00394a]/5">
                <DocumentStatusBadge
                  document={documentsByType[DocumentType.Diploma]}
                  Icon={GraduationCap}
                  title="Diploma"
                  verifiedText="Medical Degree Verified"
                />
                <DocumentStatusBadge
                  document={documentsByType[DocumentType.ProfessionalLicense]}
                  Icon={FileBadge}
                  title="Professional License"
                  verifiedText="License Verified"
                />
                <DocumentStatusBadge
                  document={documentsByType[DocumentType.Id]}
                  Icon={IdCard}
                  title="ID Card"
                  verifiedText="Identity Verified"
                />
                <DocumentStatusBadge
                  document={documentsByType[DocumentType.Insurance]}
                  Icon={Shield}
                  title="Liability Insurance"
                  verifiedText="Insurance Verified"
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
