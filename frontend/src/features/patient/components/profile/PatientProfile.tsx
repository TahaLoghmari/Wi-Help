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
          className="group border-brand-dark/20 bg-brand-bg text-brand-secondary hover:border-brand-dark/40 hover:text-brand-dark mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:bg-white active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      )}

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
                  <h2 className="text-brand-dark flex items-center gap-2 text-xl font-bold tracking-tight">
                    {patient?.gender === "male" ? "Mr" : "Ms"}.{" "}
                    {patient?.firstName} {patient?.lastName}
                    <ShieldCheck className="fill-brand-blue/10 text-brand-blue h-5 w-5" />
                  </h2>
                  <p className="text-brand-secondary text-sm">
                    Patient Profile
                  </p>
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                  <User className="text-brand-secondary h-3.5 w-3.5" />
                  <span className="text-brand-dark font-medium">
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
          <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
            <h3 className="text-brand-dark mb-4 flex items-center gap-2 text-sm font-bold tracking-tight">
              <User className="text-brand-secondary h-4 w-4" />
              About &amp; Bio
            </h3>
            <div className="prose prose-sm text-brand-secondary mb-6 max-w-none text-xs leading-relaxed">
              {patient?.bio || "No bio provided yet."}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                <div className="text-brand-dark rounded-full border bg-white p-2">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                  Gender
                </div>
                <div className="text-brand-dark text-xs font-semibold">
                  {patient?.gender
                    ? patient.gender.charAt(0).toUpperCase() +
                      patient.gender.slice(1).toLowerCase()
                    : "N/A"}
                </div>
              </div>
              <div className="border-brand-dark/10 bg-brand-bg flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
                <div className="text-brand-dark rounded-full border bg-white p-2">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-brand-secondary text-[10px] font-semibold tracking-wider uppercase">
                  Mobility
                </div>
                <div className="text-brand-dark text-xs font-semibold">
                  {patient?.medicalInfo?.mobilityStatus || "N/A"}
                </div>
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="border-brand-dark/10 rounded-2xl border bg-white p-5">
            <h3 className="text-brand-dark mb-4 flex items-center gap-2 text-sm font-bold tracking-tight">
              <Heart className="text-brand-secondary h-4 w-4" />
              Medical Information
            </h3>

            {/* Allergies */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="text-brand-dark mb-2 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="text-brand-dark h-3.5 w-3.5" />
                Allergies
              </div>
              {patient?.medicalInfo?.allergies &&
              patient.medicalInfo.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="border-brand-dark/20 bg-brand-bg text-brand-secondary hover:bg-brand-dark/10 cursor-default rounded-full border px-2 py-1 text-[10px] font-medium transition-colors"
                    >
                      {ALLERGIES.find((a) => a.value === allergy)?.label ||
                        allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-brand-secondary/60 text-xs">
                  No allergies reported
                </p>
              )}
            </div>

            {/* Medications */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="text-brand-dark mb-2 flex items-center gap-2 text-xs font-semibold">
                <Pill className="text-brand-blue h-3.5 w-3.5" />
                Current Medications
              </div>
              {patient?.medicalInfo?.medications &&
              patient.medicalInfo.medications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.medications.map((medication, index) => (
                    <span
                      key={index}
                      className="border-brand-dark/20 bg-brand-bg text-brand-secondary hover:bg-brand-dark/10 cursor-default rounded-full border px-2 py-1 text-[10px] font-medium transition-colors"
                    >
                      {MEDICATIONS.find((m) => m.value === medication)?.label ||
                        medication}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-brand-secondary/60 text-xs">
                  No medications listed
                </p>
              )}
            </div>

            {/* Chronic Conditions */}
            <div className="flex flex-col gap-2">
              <div className="text-brand-dark mb-2 flex items-center gap-2 text-xs font-semibold">
                <Activity className="text-brand-teal h-3.5 w-3.5" />
                Chronic Conditions
              </div>
              {patient?.medicalInfo?.chronicConditions &&
              patient.medicalInfo.chronicConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalInfo.chronicConditions.map(
                    (condition, index) => (
                      <span
                        key={index}
                        className="border-brand-dark/20 bg-brand-bg text-brand-secondary hover:bg-brand-dark/10 cursor-default rounded-full border px-2 py-1 text-[10px] font-medium transition-colors"
                      >
                        {CHRONIC_CONDITIONS.find((c) => c.value === condition)
                          ?.label || condition}
                      </span>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-brand-secondary/60 text-xs">
                  No chronic conditions reported
                </p>
              )}
            </div>
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
                <div className="text-brand-secondary mt-0.5 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-brand-dark text-xs font-semibold">
                    Email
                  </div>
                  <span className="text-brand-blue mt-0.5 block text-xs hover:underline">
                    {patient?.email}
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
                    +216 {patient?.phoneNumber}
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
                    {patient?.dateOfBirth || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="border-brand-dark/10 overflow-hidden rounded-2xl border bg-white">
            <div className="border-brand-dark/10 bg-brand-bg flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-brand-dark text-xs font-bold tracking-tight">
                Emergency Contact
              </h3>
              <span className="border-brand-cream bg-brand-cream/50 text-brand-dark rounded-full border px-2 py-0.5 text-[10px] font-medium">
                Important
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex gap-3">
                <div className="text-brand-secondary mt-0.5 shrink-0">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-brand-dark text-xs font-semibold">
                    Full Name
                  </div>
                  <div className="text-brand-secondary mt-0.5 text-xs">
                    {patient?.emergencyContact?.fullName || "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-brand-secondary mt-0.5 shrink-0">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-brand-dark text-xs font-semibold">
                    Relationship
                  </div>
                  <div className="text-brand-secondary mt-0.5 text-xs">
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
                <div className="text-brand-secondary mt-0.5 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-brand-dark text-xs font-semibold">
                    Phone Number
                  </div>
                  <div className="text-brand-secondary mt-0.5 text-xs">
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
