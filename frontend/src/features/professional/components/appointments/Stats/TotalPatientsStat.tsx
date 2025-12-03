import { Users } from "lucide-react";

interface TotalPatientsStatProps {
  totalPatients: number;
  isLoading?: boolean;
}

export function TotalPatientsStat({
  totalPatients,
  isLoading,
}: TotalPatientsStatProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          Total Patients
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
          <Users className="h-4 w-4 text-blue-500" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : totalPatients.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500">
          {isLoading ? "-" : "All time"}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
          Active patients in your care
        </div>
      </div>
    </div>
  );
}
