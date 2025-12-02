import {
  Calendar,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  User,
  Heart,
  Pill,
  AlertCircle,
  Activity,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import {
  ALLERGIES,
  CHRONIC_CONDITIONS,
  MEDICATIONS,
  type PatientDto,
} from "@/features/patient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { COUNTRIES, RELATIONSHIPS } from "@/features/auth";
import { useRouter } from "@tanstack/react-router";

interface PatientProfileProps {
  patient?: PatientDto;
  showBackButton?: boolean;
}

export function PatientProfile({
  patient,
  showBackButton = false,
}: PatientProfileProps) {
  const router = useRouter();

  const patientInitials =
    patient?.firstName && patient?.lastName
      ? patient.firstName.charAt(0).toUpperCase() +
        patient.lastName.charAt(0).toUpperCase()
      : "U";

  return (
    <section className="mb-6 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      {showBackButton && (
        <button
          onClick={() => router.history.back()}
          className="group mb-2 inline-flex items-center gap-2 rounded-full border border-[#00394a]/20 bg-[#fbfbfb] px-3 py-1.5 text-xs font-medium text-[#00546e] shadow-sm transition-all hover:border-[#00394a]/40 hover:bg-white hover:text-[#00394a] active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      )}

      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#00394a]/10 bg-white">
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
                  src={patient?.profilePictureUrl}
                  alt={patient?.firstName}
                />
                <AvatarFallback className="rounded-full text-lg">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1 pt-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#00394a]">
                    {patient?.gender === "male" ? "Mr" : "Ms"}.{" "}
                    {patient?.firstName} {patient?.lastName}
                    <ShieldCheck className="h-5 w-5 fill-[#3fa6ff]/10 text-[#3fa6ff]" />
                  </h2>
                  <p className="text-sm text-[#00546e]">Patient Profile</p>
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 rounded-md border border-[#00394a]/10 bg-[#fbfbfb] px-2.5 py-1 text-xs text-[#00546e]">
                  <User className="h-3.5 w-3.5 text-[#00546e]" />
                  <span className="font-medium text-[#00394a]">
                    {patient?.gender
                      ? patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1).toLowerCase()
                      : ""}
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
          {/* About & Bio */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
              <User className="h-4 w-4 text-[#00546e]" />
              About &amp; Bio
            </h3>
            <div className="prose prose-sm mb-6 max-w-none text-xs leading-relaxed text-[#00546e]">
              {patient?.bio || "No bio provided yet."}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#00394a]">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-[#00546e] uppercase">
                  Gender
                </div>
                <div className="text-xs font-semibold text-[#00394a]">
                  {patient?.gender
                    ? patient.gender.charAt(0).toUpperCase() +
                      patient.gender.slice(1).toLowerCase()
                    : "N/A"}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#00394a]/10 bg-[#fbfbfb] p-3 text-center">
                <div className="rounded-full border bg-white p-2 text-[#00394a]">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-[#00546e] uppercase">
                  Mobility
                </div>
                <div className="text-xs font-semibold text-[#00394a]">
                  {patient?.medicalInfo?.mobilityStatus || "N/A"}
                </div>
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="rounded-2xl border border-[#00394a]/10 bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-[#00394a]">
              <Heart className="h-4 w-4 text-[#00546e]" />
              Medical Information
            </h3>

            {/* Allergies */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#00394a]">
                <AlertCircle className="h-3.5 w-3.5 text-[#00394a]" />
                Allergies
              </div>
              {patient?.medicalInfo?.allergies &&
              patient.medicalInfo.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="cursor-default rounded-full border border-[#00394a]/20 bg-[#fbfbfb] px-2 py-1 text-[10px] font-medium text-[#00546e] transition-colors hover:bg-[#00394a]/10"
                    >
                      {ALLERGIES.find((a) => a.value === allergy)?.label ||
                        allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#00546e]/60">
                  No allergies reported
                </p>
              )}
            </div>

            {/* Medications */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#00394a]">
                <Pill className="h-3.5 w-3.5 text-[#3fa6ff]" />
                Current Medications
              </div>
              {patient?.medicalInfo?.medications &&
              patient.medicalInfo.medications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.medications.map((medication, index) => (
                    <span
                      key={index}
                      className="cursor-default rounded-full border border-[#00394a]/20 bg-[#fbfbfb] px-2 py-1 text-[10px] font-medium text-[#00546e] transition-colors hover:bg-[#00394a]/10"
                    >
                      {MEDICATIONS.find((m) => m.value === medication)?.label ||
                        medication}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#00546e]/60">
                  No medications listed
                </p>
              )}
            </div>

            {/* Chronic Conditions */}
            <div className="flex flex-col gap-2">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#00394a]">
                <Activity className="h-3.5 w-3.5 text-[#14d3ac]" />
                Chronic Conditions
              </div>
              {patient?.medicalInfo?.chronicConditions &&
              patient.medicalInfo.chronicConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.chronicConditions.map(
                    (condition, index) => (
                      <span
                        key={index}
                        className="cursor-default rounded-full border border-[#00394a]/20 bg-[#fbfbfb] px-2 py-1 text-[10px] font-medium text-[#00546e] transition-colors hover:bg-[#00394a]/10"
                      >
                        {CHRONIC_CONDITIONS.find((c) => c.value === condition)
                          ?.label || condition}
                      </span>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#00546e]/60">
                  No chronic conditions reported
                </p>
              )}
            </div>
          </section>
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
                    {patient?.address?.street || "N/A"}
                    <br />
                    {patient?.address?.city}, {patient?.address?.state}{" "}
                    {patient?.address?.postalCode}
                    <br />
                    {COUNTRIES.find(
                      (c) => c.value === patient?.address?.country,
                    )?.label ||
                      patient?.address?.country ||
                      ""}
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
                    {patient?.email}
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
                    +216 {patient?.phoneNumber}
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
                    {patient?.dateOfBirth || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="overflow-hidden rounded-2xl border border-[#00394a]/10 bg-white">
            <div className="flex items-center justify-between border-b border-[#00394a]/10 bg-[#fbfbfb] px-5 py-3">
              <h3 className="text-xs font-bold tracking-tight text-[#00394a]">
                Emergency Contact
              </h3>
              <span className="rounded-full border border-[#ffecb4] bg-[#ffecb4]/50 px-2 py-0.5 text-[10px] font-medium text-[#00394a]">
                Important
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Full Name
                  </div>
                  <div className="mt-0.5 text-xs text-[#00546e]">
                    {patient?.emergencyContact?.fullName || "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Relationship
                  </div>
                  <div className="mt-0.5 text-xs text-[#00546e]">
                    {RELATIONSHIPS.find(
                      (r) =>
                        r.value === patient?.emergencyContact?.relationship,
                    )?.label ||
                      patient?.emergencyContact?.relationship ||
                      "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-[#00546e]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00394a]">
                    Phone Number
                  </div>
                  <div className="mt-0.5 text-xs text-[#00546e]">
                    +216 {patient?.emergencyContact?.phoneNumber || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
