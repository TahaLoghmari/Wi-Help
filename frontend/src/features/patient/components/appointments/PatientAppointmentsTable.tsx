import { useState } from "react";
import { AppointmentUrgency, AppointmentStatus } from "@/features/professional";
import {
  CancelAppointment,
  GetPatientAppointments,
  type GetPatientAppointmentsDto,
} from "@/features/patient";
import { getSpecializations } from "@/features/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { X, Calendar } from "lucide-react";
import { useAppNavigation } from "@/hooks";
import { useTranslation } from "react-i18next";

type AppointmentTab = "offered" | "confirmed" | "cancelled" | "completed";

export function PatientAppointmentsTable() {
  const { t, i18n } = useTranslation();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetPatientAppointments();

  const cancelAppointmentMutation = CancelAppointment();

  const { goToProfessionalProfile } = useAppNavigation();

  const appointments = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetPatientAppointmentsDto | null>(null);

  const [activeTab, setActiveTab] = useState<AppointmentTab>("offered");

  const handleView = (appointment: GetPatientAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleCancel = (appointment: GetPatientAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleProfessionalProfileClick = (
    appointment: GetPatientAppointmentsDto,
  ) => {
    goToProfessionalProfile(appointment.professionalId);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      cancelAppointmentMutation.mutate(selectedAppointment.id);
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      switch (activeTab) {
        case "offered":
          return appointment.status === AppointmentStatus.Offered;
        case "confirmed":
          return appointment.status === AppointmentStatus.Confirmed;
        case "cancelled":
          return appointment.status === AppointmentStatus.Cancelled;
        case "completed":
          return appointment.status === AppointmentStatus.Completed;
        default:
          return false;
      }
    });
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "offered":
        return {
          title: t("patient.appointments.table.empty.offered.title"),
          description: t(
            "patient.appointments.table.empty.offered.description",
          ),
        };
      case "confirmed":
        return {
          title: t("patient.appointments.table.empty.confirmed.title"),
          description: t(
            "patient.appointments.table.empty.confirmed.description",
          ),
        };
      case "cancelled":
        return {
          title: t("patient.appointments.table.empty.cancelled.title"),
          description: t(
            "patient.appointments.table.empty.cancelled.description",
          ),
        };
      case "completed":
        return {
          title: t("patient.appointments.table.empty.completed.title"),
          description: t(
            "patient.appointments.table.empty.completed.description",
          ),
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        {t("patient.appointments.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {t("patient.appointments.error")}
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();
  const emptyState = getEmptyStateMessage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              {t("patient.appointments.title")}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {t("patient.appointments.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs whitespace-nowrap scrollbar-hide">
          <button
            id="appt-tab-offered"
            onClick={() => setActiveTab("offered")}
            className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-colors ${
              activeTab === "offered"
                ? "text-brand-dark border-slate-200 bg-white"
                : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                activeTab === "offered" ? "bg-brand-blue" : "bg-slate-300"
              }`}
            ></span>
            {t("patient.appointments.tabs.offered")}
          </button>
          <button
            id="appt-tab-confirmed"
            onClick={() => setActiveTab("confirmed")}
            className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
              activeTab === "confirmed"
                ? "text-brand-dark border-slate-200 bg-white font-medium"
                : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                activeTab === "confirmed" ? "bg-brand-blue" : "bg-slate-300"
              }`}
            ></span>
            {t("patient.appointments.tabs.confirmed")}
          </button>
          <button
            id="appt-tab-cancelled"
            onClick={() => setActiveTab("cancelled")}
            className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
              activeTab === "cancelled"
                ? "text-brand-dark border-slate-200 bg-white font-medium"
                : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                activeTab === "cancelled" ? "bg-brand-blue" : "bg-slate-300"
              }`}
            ></span>
            {t("patient.appointments.tabs.cancelled")}
          </button>
          <button
            id="appt-tab-completed"
            onClick={() => setActiveTab("completed")}
            className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
              activeTab === "completed"
                ? "text-brand-dark border-slate-200 bg-white font-medium"
                : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                activeTab === "completed" ? "bg-brand-blue" : "bg-slate-300"
              }`}
            ></span>
            {t("patient.appointments.tabs.completed")}
          </button>
        </div>
      </div>

      <div className="min-h-[400px] overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.professional")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.date")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.purpose")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.urgency")}
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.price")}
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                {t("patient.appointments.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        {emptyState.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {emptyState.description}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-slate-50/70">
                  <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleProfessionalProfileClick(appointment)
                        }
                        className="transition-opacity hover:opacity-80"
                      >
                        {appointment.professional?.profilePictureUrl ? (
                          <img
                            src={appointment.professional.profilePictureUrl}
                            alt={`${appointment.professional.firstName} ${appointment.professional.lastName}`}
                            className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {appointment.professional?.firstName?.charAt(0) ||
                              "?"}
                          </div>
                        )}
                      </button>
                      <div>
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {appointment.professional
                            ? `${appointment.professional.firstName} ${appointment.professional.lastName}`
                            : t("patient.appointments.unknownProfessional")}
                        </div>
                        {appointment.professional?.specialization && (
                          <div className="text-[11px] text-slate-500">
                            {getSpecializations(i18n.language).find(
                              (s) =>
                                s.value ===
                                appointment.professional?.specialization,
                            )?.label || appointment.professional.specialization}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                    {new Date(appointment.startDate).toLocaleDateString()} •{" "}
                    {new Date(appointment.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                    {appointment.notes || (
                      <span className="text-slate-400 italic">
                        {t("patient.appointments.noPurpose")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                        appointment.urgency === AppointmentUrgency.High
                          ? "border-red-200 bg-red-50 text-red-700"
                          : appointment.urgency === AppointmentUrgency.Medium
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : "border-brand-blue/40 bg-brand-blue/10 text-brand-dark"
                      }`}
                    >
                      {appointment.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                    {appointment.price.toFixed(2)} TND
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleView(appointment)}
                        className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                      >
                        {t("patient.appointments.actions.view")}
                      </button>
                      {(appointment.status === AppointmentStatus.Offered ||
                        appointment.status === AppointmentStatus.Confirmed) && (
                        <button
                          onClick={() => handleCancel(appointment)}
                          disabled={cancelAppointmentMutation.isPending}
                          className="inline-flex items-center rounded-full border border-red-200 bg-white px-2 py-1 text-[11px] text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("patient.appointments.actions.cancel")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 gap-x-3 gap-y-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
        <div className="text-[11px] text-slate-500">
          {t("patient.appointments.pagination.showing")}
          <span className="font-medium text-slate-700">
            {" "}
            {appointments.length}{" "}
          </span>
          {t("patient.appointments.pagination.of")}
          <span className="font-medium text-slate-700"> {totalCount} </span>
          {t("patient.appointments.pagination.appointments")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? t("patient.appointments.pagination.loadingMore")
              : hasNextPage
                ? t("patient.appointments.pagination.loadMore")
                : t("patient.appointments.pagination.noMore")}
          </button>
        </div>
      </div>

      {/* View Appointment Sheet */}
      <Sheet open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-xl! border-l border-slate-200 p-0 [&>button]:hidden"
        >
          {selectedAppointment && (
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-5 backdrop-blur-sm">
                <div>
                  <h2 className="text-brand-dark text-lg font-bold tracking-tight">
                    {t("patient.appointments.sheet.title")}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {t("patient.appointments.sheet.subtitle")}
                  </p>
                </div>
                <SheetClose className="-mr-2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {/* Professional */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  {selectedAppointment.professional?.profilePictureUrl ? (
                    <img
                      src={selectedAppointment.professional.profilePictureUrl}
                      alt={selectedAppointment.professional.firstName}
                      className="h-14 w-14 rounded-full border-[3px] border-white object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-sm font-medium text-slate-500">
                      {selectedAppointment.professional?.firstName?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {selectedAppointment.professional?.firstName ||
                        t("patient.appointments.unknownProfessional")}
                    </h3>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {t("patient.appointments.sheet.professionalId")}{" "}
                          {selectedAppointment.professionalId.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {t("patient.appointments.sheet.startTime")}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="bg-brand-secondary h-8 w-1 rounded-full"></div>
                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          {new Date(
                            selectedAppointment.startDate,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {new Date(
                            selectedAppointment.startDate,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {t("patient.appointments.sheet.endTime")}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="bg-brand-secondary h-8 w-1 rounded-full"></div>
                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          {new Date(
                            selectedAppointment.endDate,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {new Date(
                            selectedAppointment.endDate,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Urgency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("patient.appointments.sheet.status")}
                    </label>
                    <div>
                      <span
                        className={`border-brand-secondary text-brand-secondary inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[10px] font-semibold`}
                      >
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("patient.appointments.sheet.urgency")}
                    </label>
                    <div>
                      <span
                        className={`border-brand-secondary text-brand-secondary inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[10px] font-semibold`}
                      >
                        {selectedAppointment.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {t("patient.appointments.sheet.totalPrice")}
                    </span>
                    <span className="text-brand-dark text-xl font-bold">
                      {selectedAppointment.price.toFixed(2)} TND
                    </span>
                  </div>
                  <div className="my-2 h-px bg-slate-200"></div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {selectedAppointment.offeredAt && (
                      <div>
                        <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                          {t("patient.appointments.sheet.offeredAt")}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-700">
                          {new Date(
                            selectedAppointment.offeredAt,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedAppointment.confirmedAt && (
                      <div>
                        <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                          {t("patient.appointments.sheet.confirmedAt")}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-700">
                          {new Date(
                            selectedAppointment.confirmedAt,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedAppointment.completedAt && (
                      <div>
                        <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                          {t("patient.appointments.sheet.completedAt")}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-700">
                          {new Date(
                            selectedAppointment.completedAt,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedAppointment.cancelledAt && (
                      <div>
                        <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                          {t("patient.appointments.sheet.cancelledAt")}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-700">
                          {new Date(
                            selectedAppointment.cancelledAt,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {t("patient.appointments.sheet.purposeNotes")}
                  </label>
                  <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 italic">
                    {selectedAppointment.notes ||
                      t("patient.appointments.sheet.noNotes")}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 z-10 flex gap-3 border-t border-slate-100 bg-white p-6">
                <SheetClose className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  {t("patient.appointments.sheet.close")}
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel Appointment Alert Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("patient.appointments.confirmDialogs.cancelTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("patient.appointments.confirmDialogs.cancelDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("patient.appointments.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="border border-red-600 bg-red-600 text-white hover:bg-red-700"
              onClick={handleConfirmCancel}
              disabled={cancelAppointmentMutation.isPending}
            >
              {cancelAppointmentMutation.isPending
                ? t("patient.appointments.confirmDialogs.cancelling")
                : t("patient.appointments.confirmDialogs.cancelAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
