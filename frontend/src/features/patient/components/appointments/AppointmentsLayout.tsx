import {
  PatientAppointmentsTable,
  TodayAppointmentsStat,
  TotalAppointmentsStat,
  TotalProfessionalsStat,
} from "@/features/patient";

export function AppointmentsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-4 sm:px-8 py-5 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TotalProfessionalsStat />
        <TotalAppointmentsStat />
        <TodayAppointmentsStat />
      </div>
      <PatientAppointmentsTable />
    </div>
  );
}
