import { useState, useRef } from "react";
import {
  AppointmentUrgency,
  AppointmentStatus,
  GetProfessionalAppointments,
  type GetProfessionalAppointmentsDto,
  RespondToAppointment,
  CancelAppointmentByProfessional,
  CompleteAppointment,
} from "@/features/professional";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Calendar, Upload, FileText } from "lucide-react";
import { useAppNavigation } from "@/hooks";

type AppointmentTab = "offered" | "confirmed" | "cancelled" | "completed";

export function AppointmentsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetProfessionalAppointments();

  const respondToAppointmentMutation = RespondToAppointment();
  const cancelAppointmentMutation = CancelAppointmentByProfessional();
  const completeAppointmentMutation = CompleteAppointment();

  const { goToPatientProfile } = useAppNavigation();

  const appointments = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [activeTab, setActiveTab] = useState<AppointmentTab>("offered");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetProfessionalAppointmentsDto | null>(null);

  // Prescription upload state
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionTitle, setPrescriptionTitle] = useState("");
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleView = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleAccept = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setAcceptDialogOpen(true);
  };

  const handleCancel = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleMarkComplete = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setPrescriptionFile(null);
    setPrescriptionTitle("");
    setPrescriptionNotes("");
    setCompleteDialogOpen(true);
  };

  const handlePatientProfileClick = (
    appointment: GetProfessionalAppointmentsDto,
  ) => {
    goToPatientProfile(appointment.patientId);
  };

  const handleConfirmAppointment = () => {
    if (selectedAppointment) {
      respondToAppointmentMutation.mutate({
        appointmentId: selectedAppointment.id,
        isAccepted: true,
      });
      setAcceptDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      // For offered appointments, use respond with isAccepted: false
      if (selectedAppointment.status === AppointmentStatus.Offered) {
        respondToAppointmentMutation.mutate({
          appointmentId: selectedAppointment.id,
          isAccepted: false,
        });
      } else {
        // For confirmed appointments, use the dedicated cancel endpoint
        cancelAppointmentMutation.mutate(selectedAppointment.id);
      }
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleCompleteAppointment = () => {
    if (selectedAppointment && prescriptionFile) {
      completeAppointmentMutation.mutate({
        appointmentId: selectedAppointment.id,
        prescriptionPdf: prescriptionFile,
        prescriptionTitle: prescriptionTitle || undefined,
        prescriptionNotes: prescriptionNotes || undefined,
      });
      setCompleteDialogOpen(false);
      setSelectedAppointment(null);
      setPrescriptionFile(null);
      setPrescriptionTitle("");
      setPrescriptionNotes("");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPrescriptionFile(file);
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
          title: "No offered appointments",
          description:
            "You don't have any pending appointment offers at the moment.",
        };
      case "confirmed":
        return {
          title: "No confirmed appointments",
          description: "You don't have any confirmed appointments yet.",
        };
      case "cancelled":
        return {
          title: "No cancelled appointments",
          description: "You don't have any cancelled appointments.",
        };
      case "completed":
        return {
          title: "No completed appointments",
          description: "You don't have any completed appointments yet.",
        };
    }
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

  const filteredAppointments = getFilteredAppointments();
  const emptyState = getEmptyStateMessage();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              Patient Appointments
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage upcoming and today’s appointments with quick actions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 pb-1 text-xs">
          <button
            id="appt-tab-offered"
            onClick={() => setActiveTab("offered")}
            className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-colors ${
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
            Offered
          </button>
          <button
            id="appt-tab-confirmed"
            onClick={() => setActiveTab("confirmed")}
            className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
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
            Confirmed
          </button>
          <button
            id="appt-tab-cancelled"
            onClick={() => setActiveTab("cancelled")}
            className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
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
            Cancelled
          </button>
          <button
            id="appt-tab-completed"
            onClick={() => setActiveTab("completed")}
            className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
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
            Completed
          </button>
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
                Date
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Purpose
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Urgency
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Price
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Actions
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
                        onClick={() => handlePatientProfileClick(appointment)}
                        className="transition-opacity hover:opacity-80"
                      >
                        {appointment.patient?.profilePictureUrl ? (
                          <img
                            src={appointment.patient.profilePictureUrl}
                            alt={appointment.patient.firstName}
                            className="h-8 w-8 cursor-pointer rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {appointment.patient?.firstName?.charAt(0) || "?"}
                          </div>
                        )}
                      </button>
                      <div className="">
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {appointment.patient?.firstName || "Unknown Patient"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {appointment.patient?.dateOfBirth ? (
                            <span>
                              DOB:{" "}
                              {new Date(
                                appointment.patient.dateOfBirth,
                              ).toLocaleDateString()}
                            </span>
                          ) : (
                            <span>
                              Patient ID:{" "}
                              {appointment.patientId.substring(0, 6)}
                            </span>
                          )}
                        </div>
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
                        No purpose specified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                        appointment.urgency === "High"
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
                    ${appointment.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                    <div className="flex items-center justify-end gap-1.5">
                      {appointment.status === AppointmentStatus.Offered && (
                        <>
                          <button
                            onClick={() => handleAccept(appointment)}
                            disabled={respondToAppointmentMutation.isPending}
                            className="border-brand-dark bg-brand-dark hover:bg-brand-secondary inline-flex items-center rounded-full border px-2 py-1 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleCancel(appointment)}
                            disabled={respondToAppointmentMutation.isPending}
                            className="inline-flex items-center rounded-full border border-red-200 bg-white px-2 py-1 text-[11px] text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === AppointmentStatus.Confirmed && (
                        <>
                          <button
                            onClick={() => handleMarkComplete(appointment)}
                            disabled={completeAppointmentMutation.isPending}
                            className="border-brand-dark bg-brand-dark hover:bg-brand-secondary inline-flex items-center rounded-full border px-2 py-1 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancel(appointment)}
                            disabled={cancelAppointmentMutation.isPending}
                            className="inline-flex items-center rounded-full border border-red-200 bg-white px-2 py-1 text-[11px] text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleView(appointment)}
                        className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                      >
                        View
                      </button>
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
          Showing
          <span className="font-medium text-slate-700">
            {" "}
            {appointments.length}{" "}
          </span>
          of
          <span className="font-medium text-slate-700"> {totalCount} </span>
          appointments.
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "No more appointments"}
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
                      {selectedAppointment.patient?.firstName ||
                        "Unknown Patient"}
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
              <div className="sticky bottom-0 z-10 flex gap-3 border-t border-slate-100 bg-white p-6">
                <SheetClose className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  Close
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Accept Appointment Alert Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this appointment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-dark"
              onClick={handleConfirmAppointment}
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment Alert Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="border border-red-600 bg-red-600 text-white hover:bg-red-700"
              onClick={handleCancelAppointment}
              disabled={
                respondToAppointmentMutation.isPending ||
                cancelAppointmentMutation.isPending
              }
            >
              {respondToAppointmentMutation.isPending ||
              cancelAppointmentMutation.isPending
                ? "Cancelling..."
                : "Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Appointment Dialog with Prescription Upload */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Appointment as Completed</DialogTitle>
            <DialogDescription>
              Upload a prescription PDF to complete this appointment. This
              prescription will be available to the patient.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 pb-4">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="mb-2 text-sm font-medium text-slate-700">
                  Prescription PDF <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    prescriptionFile
                      ? "border-emerald-300 bg-emerald-50"
                      : "hover:border-brand-blue hover:bg-brand-blue/5 border-slate-300"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {prescriptionFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {prescriptionFile.name}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      <Upload className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-400">PDF only</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Prescription Title (optional)
                </label>
                <input
                  type="text"
                  value={prescriptionTitle}
                  onChange={(e) => setPrescriptionTitle(e.target.value)}
                  placeholder="e.g., General Consultation Prescription"
                  className="focus:border-brand-blue focus:ring-brand-blue mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                />
              </div>

              {/* Prescription Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Notes (optional)
                </label>
                <textarea
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  placeholder="Additional notes about the prescription..."
                  rows={3}
                  className="focus:border-brand-blue focus:ring-brand-blue mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setCompleteDialogOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteAppointment}
              disabled={
                !prescriptionFile || completeAppointmentMutation.isPending
              }
              className="bg-brand-dark hover:bg-brand-dark/70 rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {completeAppointmentMutation.isPending
                ? "Completing..."
                : "Complete Appointment"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
