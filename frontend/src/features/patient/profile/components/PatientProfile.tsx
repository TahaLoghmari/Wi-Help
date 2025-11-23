import { Calendar, Phone } from "lucide-react";
import {
  ALLERGIES,
  CHRONIC_CONDITIONS,
  MEDICATIONS,
  type PatientDto,
} from "@/features/patient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { COUNTRIES, RELATIONSHIPS } from "@/features/auth";

interface PatientProfileProps {
  patient?: PatientDto;
}

export function PatientProfile({ patient }: PatientProfileProps) {
  return (
    <section className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage
                className="object-cover"
                src={patient?.profilePictureUrl}
                alt={patient?.firstName}
              />
              <AvatarFallback className="rounded-lg">
                {patient?.firstName && patient?.lastName
                  ? patient.firstName.charAt(0).toUpperCase() +
                    patient.lastName.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
                  {patient?.gender === "male" ? "Mr" : "Ms"}.{" "}
                  {patient?.firstName} {patient?.lastName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
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
                    data-lucide="shield-check"
                    className="lucide lucide-shield-check h-3.5 w-3.5"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700">
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
                  data-lucide="briefcase"
                  className="lucide lucide-briefcase h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-900">312</span>
                  <span className="text-slate-500">Appointments taken</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              About &amp; Bio
            </h3>
            <p className="text-xs leading-relaxed text-slate-700">
              {patient?.bio}
            </p>
            <div className="mt-1 grid gap-2 text-[11px] text-slate-700 sm:grid-cols-2">
              <div className="flex items-center gap-2">
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
                  data-lucide="id-card"
                  className="lucide lucide-stethoscope h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M16 10h2"></path>
                  <path d="M16 14h2"></path>
                  <path d="M6.17 15a3 3 0 0 1 5.66 0"></path>
                  <circle cx="9" cy="11" r="2"></circle>
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                </svg>
                <span>
                  <span className="text-slate-500">Gender: </span>
                  {patient?.gender
                    ? patient.gender.charAt(0).toUpperCase() +
                      patient.gender.slice(1).toLowerCase()
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 stroke-1 text-slate-500" />
                <span>
                  <span className="text-slate-500">Date Of Birth: </span>
                  {patient?.dateOfBirth}
                </span>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-[11px] shadow-sm shadow-slate-100 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
                Medical Info
              </h3>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-slate-500">Mobility Status: </span>
              {patient?.medicalInfo.mobilityStatus}
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-slate-500">Allergies:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {patient?.medicalInfo.allergies.map((allergie, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700"
                  >
                    {
                      ALLERGIES.find(
                        (allergie_) => allergie_.value === allergie,
                      )?.label
                    }
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-slate-500">Medications:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {patient?.medicalInfo.medications.map((medication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700"
                  >
                    {
                      MEDICATIONS.find(
                        (medication_) => medication_.value === medication,
                      )?.label
                    }
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-slate-500">Chronic Conditions:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {patient?.medicalInfo.chronicConditions.map(
                  (chronicCondition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700"
                    >
                      {
                        CHRONIC_CONDITIONS.find(
                          (chronicCondition_) =>
                            chronicCondition_.value === chronicCondition,
                        )?.label
                      }
                    </span>
                  ),
                )}
              </div>
            </div>
          </section>
        </div>
        <aside className="col-span-1 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              Address &amp; Contact
            </h3>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
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
                    data-lucide="home"
                    className="lucide lucide-home h-3.5 w-3.5 text-slate-500"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <p className="text-slate-500">Address</p>
                </div>
                <div className="grid gap-1 pl-5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Street: </span>
                    <span className="font-medium tracking-tight text-slate-900">
                      {patient?.address.street}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">City: </span>
                    <span className="font-medium tracking-tight text-slate-900">
                      {patient?.address.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">State: </span>
                    <span className="font-medium tracking-tight text-slate-900">
                      {patient?.address.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Postal Code: </span>
                    <span className="font-medium tracking-tight text-slate-900">
                      {patient?.address.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Country: </span>
                    <span className="font-medium tracking-tight text-slate-900">
                      {COUNTRIES.find(
                        (country) =>
                          country.value === patient?.address?.country,
                      )?.label ??
                        patient?.address?.country ??
                        ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                  data-lucide="mail"
                  className="lucide lucide-mail h-3.5 w-3.5 text-slate-500"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                </svg>
                <span>
                  <span className="text-slate-500">Email: </span>
                  <span className="font-medium tracking-tight text-slate-900">
                    {patient?.email}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 stroke-1 text-slate-500" />
                <span>
                  Phone Number:{" "}
                  <span className="font-medium tracking-tight text-slate-900">
                    +216 {patient?.phoneNumber}
                  </span>
                </span>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              Emergency Contact
            </h3>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-user h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>
                  <span className="text-slate-500">Name: </span>
                  <span className="font-medium tracking-tight text-slate-900">
                    {patient?.emergencyContact.fullName}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-heart-handshake h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.92 0l2.96 2.97" />
                  <path d="M18 15v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2" />
                </svg>
                <span>
                  <span className="text-slate-500">Relationship: </span>
                  <span className="font-medium tracking-tight text-slate-900">
                    {RELATIONSHIPS.find(
                      (relationship) =>
                        relationship.value ===
                        patient?.emergencyContact.relationship,
                    )?.label ?? ""}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 stroke-1 text-slate-500" />
                <span>
                  <span className="text-slate-500">Phone Number: </span>
                  <span className="font-medium tracking-tight text-slate-900">
                    +216 {patient?.emergencyContact.phoneNumber}
                  </span>
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
