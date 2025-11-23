import { useProfessionalPatients } from "../../hooks";
import { useNavigate } from "@tanstack/react-router";

interface Patient {
  imageUrl: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  city: string;
  state: string;
  id: string;
  phoneNumber: string;
  lastVisit: string;
  status: string;
  careModality: string;
  originalId: string;
}

export function MyPatientsCards() {
  const { data: patients, isLoading } = useProfessionalPatients();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          text: "text-[#14d3ac]",
          bg: "bg-[#14d3ac]",
        };
      case "inactive":
        return {
          text: "text-[#ef4444]",
          bg: "bg-[#ef4444]",
        };
      case "new":
        return {
          text: "text-[#3b82f6]",
          bg: "bg-[#3b82f6]",
        };
      default:
        return {
          text: "text-slate-500",
          bg: "bg-slate-500",
        };
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-500">Loading patients...</div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">No patients found.</div>
    );
  }

  const mappedPatients: Patient[] = patients.map((p) => ({
    imageUrl: p.profilePictureUrl || "https://via.placeholder.com/150",
    firstName: p.firstName,
    lastName: p.lastName,
    age: calculateAge(p.dateOfBirth),
    gender: p.gender === "Male" ? "M" : p.gender === "Female" ? "F" : "O",
    city: p.address?.city || "Unknown",
    state: p.address?.state || "Unknown",
    id: p.id.substring(0, 6).toUpperCase(), // Mocking a short ID
    phoneNumber: p.phoneNumber,
    lastVisit: "N/A", // Mocking missing data
    status: "Active", // Mocking missing data
    careModality: "Hybrid", // Mocking missing data
    originalId: p.id,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mappedPatients.map((patient, index) => (
        <article
          key={index}
          className="flex h-45 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:border-[#3fa6ff]/70 hover:shadow-md hover:shadow-slate-100"
        >
          <div className="items:center flex gap-3">
            <img
              src={patient.imageUrl}
              alt="Patient"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-xs font-medium tracking-tight text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h4>
                <span className="inline-flex items-center rounded-full border border-[#ffecb4] bg-[#ffecb4]/60 px-1.5 py-0.5 text-[10px] text-[#00394a]">
                  ID: {patient.id}
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {patient.age} yrs • {patient.gender} • {patient.city} •{" "}
                {patient.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="phone"
                className="lucide lucide-phone h-3.5 w-3.5 text-slate-400"
              >
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
              </svg>
              <span className="">{patient.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-self-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="map-pin"
                className="lucide lucide-map-pin h-3.5 w-3.5 text-slate-400"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-[11px] text-slate-500">
            <span className="">Last visit: {patient.lastVisit}</span>
            <span
              className={`inline-flex items-center gap-1 ${getStatusColor(patient.status).text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${getStatusColor(patient.status).bg}`}
              ></span>
              {patient.status}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="message-circle"
                className="lucide lucide-message-circle h-3.5 w-3.5 text-slate-500"
              >
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
              </svg>
              Message
            </button>
            <button
              onClick={() =>
                navigate({
                  to: "/professional/patient/$patientId",
                  params: { patientId: patient.originalId },
                })
              }
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#00394a] px-2 py-1.5 text-[11px] text-white transition-colors hover:bg-[#00546e]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="user"
                className="lucide lucide-user h-3.5 w-3.5 text-white"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              View Profile
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
