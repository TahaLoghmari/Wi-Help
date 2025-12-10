import {
  useGetAllPrescriptionsForAdmin,
  useDeletePrescriptionForAdmin,
} from "@/features/admin/hooks";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";

export function AdminPrescriptionsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPrescriptionsForAdmin();

  const deleteMutation = useDeletePrescriptionForAdmin();

  const prescriptions = data?.pages.flatMap((page) => page.items) || [];

  const handleDelete = (prescriptionId: string) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      deleteMutation.mutate(prescriptionId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading prescriptions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading prescriptions
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              Prescriptions
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage patient prescriptions.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Patient
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Professional
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Title
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Date
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Document
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-[350px] px-4 text-center align-middle sm:px-5"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          No prescriptions
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No prescriptions found in the system.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-slate-50/70">
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {prescription.patientProfilePicture ? (
                          <img
                            src={prescription.patientProfilePicture}
                            alt={prescription.patientName}
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {prescription.patientName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {prescription.patientName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {prescription.professionalProfilePicture ? (
                          <img
                            src={prescription.professionalProfilePicture}
                            alt={prescription.professionalName}
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {prescription.professionalName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {prescription.professionalName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="font-medium text-slate-900">
                        {prescription.title}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-500 sm:px-5">
                      {format(new Date(prescription.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      {prescription.prescriptionUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 h-8 gap-2"
                          asChild
                        >
                          <a
                            href={prescription.prescriptionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View
                          </a>
                        </Button>
                      ) : (
                        <span className="text-slate-400 italic">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(prescription.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasNextPage && (
          <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : "Load more prescriptions"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
