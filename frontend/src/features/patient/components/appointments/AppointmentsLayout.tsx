import {
  AppointmentsStat,
  PatientAppointmentsTable,
  TodayAppointmentsStat,
  TotalAppointmentsStat,
} from "@/features/patient";

export function AppointmentsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <div className="grid grid-cols-3 gap-4">
        <TotalAppointmentsStat />
        <TodayAppointmentsStat />
        <AppointmentsStat />
      </div>
      <PatientAppointmentsTable />
    </div>
  );
}
