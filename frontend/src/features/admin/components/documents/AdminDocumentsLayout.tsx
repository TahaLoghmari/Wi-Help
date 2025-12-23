import { AdminDocumentsTable } from "./AdminDocumentsTable";
import { AdminPrescriptionsTable } from "./AdminPrescriptionsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminDocumentsLayout() {
  return (
    <div className="space-y-6 p-6 overflow-auto">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          Documents
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
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
