import { createFileRoute } from "@tanstack/react-router";
import { ProfessionalProfileView } from "@/features/patient";

export const Route = createFileRoute("/admin/professionals/$professionalId")({
  component: AdminProfessionalProfilePage,
});

function AdminProfessionalProfilePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/50">
      <ProfessionalProfileView />
    </div>
  );
}
