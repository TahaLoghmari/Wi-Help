import { PrescriptionsTable } from "./PrescriptionsTable";
import { TotalPrescriptionsStat, RecentPrescriptionsStat } from "./Stats";

export function PrescriptionsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <div className="grid grid-cols-2 gap-4">
        <TotalPrescriptionsStat />
        <RecentPrescriptionsStat />
      </div>
      <PrescriptionsTable />
    </div>
  );
}
