import { useState } from "react";
import {
  GetAllAppointments,
  UpdateAppointmentStatus,
  type GetAllAppointmentsDto,
  AppointmentStatus,
} from "@/features/admin";
import { SPECIALIZATIONS } from "@/features/auth/lib/authConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { X, Calendar, Stethoscope } from "lucide-react";

export function AdminAppointmentsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetAllAppointments();

  const updateStatusMutation = UpdateAppointmentStatus();

  const appointments = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetAllAppointmentsDto | null>(null);

  const handleView = (appointment: GetAllAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleStatusChange = (
    appointmentId: string,
    status: AppointmentStatus,
  ) => {
    updateStatusMutation.mutate({ appointmentId, status });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading appointments
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2">
          <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
            All Appointments
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Manage and monitor all system appointments.
          </p>
        </div>
      </div>

      <div className="min-h-[400px] overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Doctor
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Patient
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Appointment Time
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Status
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Amount
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="h-[350px] px-4 text-center align-middle sm:px-5"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Calendar className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No appointments
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        No appointments found in the system.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-slate-50/70">
                  <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                    <div className="flex items-center gap-3">
                      {appointment.professional.profilePictureUrl ? (
                        <img
                          src={appointment.professional.profilePictureUrl}
                          alt={`${appointment.professional.firstName} ${appointment.professional.lastName}`}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                          {appointment.professional.firstName?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {appointment.professional.firstName}{" "}
                          {appointment.professional.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {SPECIALIZATIONS.find(
                            (s) =>
                              s.value ===
                              appointment.professional.specialization,
                          )?.label || appointment.professional.specialization}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                    <div className="flex items-center gap-3">
                      {appointment.patient.profilePictureUrl ? (
                        <img
                          src={appointment.patient.profilePictureUrl}
                          alt={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                          {appointment.patient.firstName?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="text-xs text-slate-700">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
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
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          appointment.id,
                          value as AppointmentStatus,
                        )
                      }
                    >
                      <SelectTrigger className="h-7 w-[120px] text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AppointmentStatus.Offered}>
                          Offered
                        </SelectItem>
                        <SelectItem value={AppointmentStatus.Confirmed}>
                          Confirmed
                        </SelectItem>
                        <SelectItem value={AppointmentStatus.Completed}>
                          Completed
                        </SelectItem>
                        <SelectItem value={AppointmentStatus.Cancelled}>
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                    ${appointment.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                    <button
                      onClick={() => handleView(appointment)}
                      className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
        <div className="text-[11px] text-slate-500">
          Showing
          <span className="font-medium text-slate-700">
            {" "}
            {appointments.length}{" "}
          </span>
          of
          <span className="font-medium text-slate-700"> {totalCount} </span>
          appointments.
        </div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "No more appointments"}
        </button>
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
                    Appointment Details
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Review full appointment information
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
                      Dr. {selectedAppointment.professional?.firstName}{" "}
                      {selectedAppointment.professional?.lastName}
                    </h3>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Stethoscope className="h-3 w-3" />
                        <span>
                          {selectedAppointment.professional?.specialization}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  {selectedAppointment.patient?.profilePictureUrl ? (
                    <img
                      src={selectedAppointment.patient.profilePictureUrl}
                      alt={selectedAppointment.patient.firstName}
                      className="h-14 w-14 rounded-full border-[3px] border-white object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-sm font-medium text-slate-500">
                      {selectedAppointment.patient?.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {selectedAppointment.patient?.firstName}{" "}
                      {selectedAppointment.patient?.lastName}
                    </h3>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {selectedAppointment.patient?.dateOfBirth
                            ? `DOB: ${new Date(selectedAppointment.patient.dateOfBirth).toLocaleDateString()}`
                            : `Patient ID: ${selectedAppointment.patientId.substring(0, 8)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Start Time
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
                      End Time
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
                      Status
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
                      Urgency
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
                      Total Price
                    </span>
                    <span className="text-brand-dark text-xl font-bold">
                      ${selectedAppointment.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="my-2 h-px bg-slate-200"></div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {selectedAppointment.offeredAt && (
                      <div>
                        <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                          Offered At
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
                          Confirmed At
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
                          Completed At
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
                          Cancelled At
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
                    Purpose / Notes
                  </label>
                  <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 italic">
                    {selectedAppointment.notes ||
                      "No notes provided for this appointment."}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 z-10 flex gap-3 bg-white p-6">
                <SheetClose className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  Close
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
