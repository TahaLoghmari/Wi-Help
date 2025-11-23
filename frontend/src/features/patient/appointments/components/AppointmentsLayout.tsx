import { PatientAppointmentsTable } from "./PatientAppointmentsTable";

export function AppointmentsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <PatientAppointmentsTable />
    </div>
  );
}
