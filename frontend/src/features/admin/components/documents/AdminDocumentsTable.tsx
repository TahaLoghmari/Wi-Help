import {
  useGetVerificationDocumentsForAdmin,
  useUpdateDocumentStatus,
  useUpdateProfessionalAccountStatus,
} from "@/features/admin/hooks";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProfessionalVerificationDto,
  VerificationDocumentAdminDto,
  VerificationStatus,
} from "@/features/admin";

export function AdminDocumentsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetVerificationDocumentsForAdmin();

  const updateDocumentStatusMutation = useUpdateDocumentStatus();
  const updateAccountStatusMutation = useUpdateProfessionalAccountStatus();

  const professionals: ProfessionalVerificationDto[] =
    data?.pages.flatMap((page) => page.items) || [];

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading documents
      </div>
    );
  }

  const handleDocumentStatusChange = (
    documentId: string,
    status: VerificationStatus,
  ) => {
    updateDocumentStatusMutation.mutate({
      documentId,
      status,
    });
  };

  const handleAccountStatusChange = (
    professionalId: string,
    status: VerificationStatus,
  ) => {
    updateAccountStatusMutation.mutate({
      professionalId,
      status,
    });
  };

  const getDocumentCell = (
    documents: VerificationDocumentAdminDto[],
    type: string,
  ) => {
    const doc = documents.find((d) => d.type === type);
    if (!doc) return <span className="text-slate-400 italic">-</span>;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <Eye className="h-3 w-3" />
            </a>
          </Button>
          <Select
            defaultValue={doc.status}
            onValueChange={(value) =>
              handleDocumentStatusChange(doc.id, value as VerificationStatus)
            }
          >
            <SelectTrigger className="h-6 w-[90px] text-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              Verification Documents
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Review professional verification documents.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Professional
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Account Status
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Diploma
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  License
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  ID Card
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Insurance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {professionals.length === 0 ? (
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
                          No documents
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No verification documents found.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                professionals.map((prof) => (
                  <tr
                    key={prof.professionalId}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 align-top whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {prof.profilePicture ? (
                          <img
                            src={prof.profilePicture}
                            alt={prof.name}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {prof.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {prof.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top whitespace-nowrap sm:px-5">
                      <Select
                        defaultValue={prof.accountStatus}
                        onValueChange={(value) =>
                          handleAccountStatusChange(
                            prof.professionalId,
                            value as VerificationStatus,
                          )
                        }
                      >
                        <SelectTrigger className="h-8 w-[110px] text-[11px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Verified">Verified</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      {getDocumentCell(prof.documents, "Diploma")}
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      {getDocumentCell(prof.documents, "ProfessionalLicense")}
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      {getDocumentCell(prof.documents, "Id")}
                    </td>
                    <td className="px-4 py-3.5 align-top sm:px-5">
                      {getDocumentCell(prof.documents, "Insurance")}
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
              {isFetchingNextPage ? "Loading more..." : "Load more documents"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
