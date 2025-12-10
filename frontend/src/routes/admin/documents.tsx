import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import {
  AdminDocumentsTable,
  AdminPrescriptionsTable,
} from "@/features/admin/components/documents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.DOCUMENTS)({
  component: AdminDocuments,
  pendingComponent: ContentLoading,
});

function AdminDocuments() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Documents
        </h1>
        <p className="text-sm text-slate-500">
          Manage verification documents and prescriptions.
        </p>
      </div>

      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="verification" className="mt-6">
          <AdminDocumentsTable />
        </TabsContent>
        <TabsContent value="prescriptions" className="mt-6">
          <AdminPrescriptionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
