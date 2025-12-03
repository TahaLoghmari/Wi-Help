interface TotalPatientsStatProps {
  totalPatients: number;
  isLoading?: boolean;
}

export function TotalPatientsStat({
  totalPatients,
  isLoading,
}: TotalPatientsStatProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between text-xs">
        <p className="text-xs font-medium tracking-tight text-slate-600">
          Total Patients
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : totalPatients.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
