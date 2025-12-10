import {
  useGetReportsForAdmin,
  useUpdateReportStatus,
} from "@/features/admin/hooks";
import { Button } from "@/components/ui/button";
import { Flag, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportAdminDto } from "@/features/admin";

interface AdminReportsTableProps {
  type?: "Patient" | "Professional";
}

export function AdminReportsTable({ type }: AdminReportsTableProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetReportsForAdmin(type);

  const updateStatusMutation = useUpdateReportStatus();

  const reports =
    data?.pages.flatMap((page) => page.items as ReportAdminDto[]) || [];

  const handleStatusChange = (reportId: string, status: string) => {
    updateStatusMutation.mutate({ reportId, data: { status } });
  };

  const getPatientDetails = (report: ReportAdminDto) => {
    const isProfessionalReport = type === "Professional";
    return isProfessionalReport
      ? {
          name: report.reportedName,
          email: report.reportedEmail,
          phone: report.reportedPhone,
          picture: report.reportedProfilePicture,
        }
      : {
          name: report.reporterName,
          email: report.reporterEmail,
          phone: report.reporterPhone,
          picture: report.reporterProfilePicture,
        };
  };

  const getProfessionalDetails = (report: ReportAdminDto) => {
    const isProfessionalReport = type === "Professional";
    return isProfessionalReport
      ? {
          name: report.reporterName,
          email: report.reporterEmail,
          phone: report.reporterPhone,
          picture: report.reporterProfilePicture,
        }
      : {
          name: report.reportedName,
          email: report.reportedEmail,
          phone: report.reportedPhone,
          picture: report.reportedProfilePicture,
        };
  };

  const renderUser = (user: {
    name: string;
    email: string;
    phone: string;
    picture: string;
  }) => (
    <div className="flex items-center gap-3">
      {user.picture ? (
        <img
          src={user.picture}
          alt={user.name}
          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
          {user.name?.charAt(0) || "?"}
        </div>
      )}
      <div>
        <div className="text-xs font-medium tracking-tight text-slate-900">
          {user.name}
        </div>
        <div className="text-[10px] text-slate-500">{user.email}</div>
        <div className="text-[10px] text-slate-500">
          {user.phone || "No phone"}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading reports
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Reviewed":
        return (
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-emerald-700"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Reviewed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700"
          >
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              {type ? `${type} Reports` : "All Reports"}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage user reports and complaints.
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
                  Description
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Date
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="h-[350px] px-4 text-center align-middle sm:px-5"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Flag className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          No reports
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No reports found in the system.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report: ReportAdminDto) => (
                  <tr key={report.id} className="hover:bg-slate-50/70">
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                      {renderUser(getPatientDetails(report))}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      {renderUser(getProfessionalDetails(report))}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="font-medium text-slate-900">
                        {report.title}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="line-clamp-2 max-w-[250px] text-xs text-slate-600">
                        {report.description}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-500 sm:px-5">
                      {format(new Date(report.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <Select
                        defaultValue={report.status}
                        onValueChange={(value) =>
                          handleStatusChange(report.id, value)
                        }
                      >
                        <SelectTrigger className="h-8 w-[110px] text-[11px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Reviewed">Reviewed</SelectItem>
                        </SelectContent>
                      </Select>
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
              {isFetchingNextPage ? "Loading more..." : "Load more reports"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
