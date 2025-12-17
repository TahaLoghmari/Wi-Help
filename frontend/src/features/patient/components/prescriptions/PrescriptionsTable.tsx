import {
  GetPatientPrescriptions,
  type GetPatientPrescriptionsDto,
} from "../../hooks/GetPatientPrescriptions";
import { getSpecializations } from "@/features/auth";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PrescriptionsTable() {
  const { t, i18n } = useTranslation();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetPatientPrescriptions();

  const prescriptions = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const handleViewPrescription = (prescription: GetPatientPrescriptionsDto) => {
    window.open(prescription.pdfUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        {t("patient.prescriptions.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {t("patient.prescriptions.error")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2">
          <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
            {t("patient.prescriptions.title")}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t("patient.prescriptions.subtitle")}
          </p>
        </div>
      </div>

      <div className="min-h-[400px] overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.prescriptions.table.createdBy")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.prescriptions.table.title")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.prescriptions.table.date")}
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.prescriptions.table.action")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prescriptions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="h-[350px] px-4 text-center align-middle sm:px-5"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-slate-400"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                        <line x1="9" y1="12" x2="15" y2="12"></line>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        {t("patient.prescriptions.empty.title")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {t("patient.prescriptions.empty.description")}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                      {prescription.professional?.profilePictureUrl ? (
                        <img
                          src={prescription.professional.profilePictureUrl}
                          alt={`${prescription.professional.firstName} ${prescription.professional.lastName}`}
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                          {prescription.professional?.firstName?.charAt(0) ||
                            "?"}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {prescription.professional
                            ? `${prescription.professional.firstName} ${prescription.professional.lastName}`
                            : "Unknown Professional"}
                        </div>
                        {prescription.professional?.specialization && (
                          <div className="text-[11px] text-slate-500">
                            {getSpecializations(i18n.language).find(
                              (s) =>
                                s.value ===
                                prescription.professional?.specialization,
                            )?.label ||
                              prescription.professional.specialization}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="text-xs font-medium text-slate-900">
                      {prescription.title || "Prescription"}
                    </div>
                    {prescription.notes && (
                      <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                        {prescription.notes}
                      </div>
                    )}
                  </td>
                  <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                    <div className="text-xs font-medium text-slate-900">
                      {new Date(prescription.issuedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}{" "}
                      •{" "}
                      {new Date(prescription.issuedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                    <button
                      onClick={() => handleViewPrescription(prescription)}
                      className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 gap-x-3 gap-y-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
        <div className="text-[11px] text-slate-500">
          Showing
          <span className="font-medium text-slate-700">
            {" "}
            {prescriptions.length}{" "}
          </span>
          of
          <span className="font-medium text-slate-700"> {totalCount} </span>
          prescriptions.
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? t("patient.prescriptions.pagination.loadingMore")
              : hasNextPage
                ? t("patient.prescriptions.pagination.loadMore")
                : t("patient.prescriptions.pagination.noMore")}
          </button>
        </div>
      </div>
    </div>
  );
}
