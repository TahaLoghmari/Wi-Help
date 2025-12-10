import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsTable } from "@/features/admin/components/reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.REPORTS)({
  component: AdminReports,
  pendingComponent: ContentLoading,
});

function AdminReports() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reports
        </h1>
        <p className="text-sm text-slate-500">
          Review and manage user reports.
        </p>
      </div>

      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="patient">Patient Reports</TabsTrigger>
          <TabsTrigger value="professional">Professional Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="patient" className="mt-6">
          <AdminReportsTable type="Patient" />
        </TabsContent>
        <TabsContent value="professional" className="mt-6">
          <AdminReportsTable type="Professional" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
