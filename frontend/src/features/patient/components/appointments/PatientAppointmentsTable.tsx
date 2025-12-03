import { useState } from "react";
import { AppointmentUrgency } from "@/features/professional";
import {
  GetPatientAppointments,
  type GetPatientAppointmentsDto,
} from "@/features/patient";

export function PatientAppointmentsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetPatientAppointments();

  const appointments = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetPatientAppointmentsDto | null>(null);

  const [activeTab, setActiveTab] = useState<"offered" | "confirmed">(
    "offered",
  );

  const handleView = (appointment: GetPatientAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleAccept = (appointment: GetPatientAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setAcceptModalOpen(true);
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              My Appointments
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage upcoming and today’s appointments with quick actions.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-[11px] sm:flex">
            <button className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors">
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
                data-lucide="sliders-horizontal"
                className="lucide lucide-sliders-horizontal h-3.5 w-3.5 text-slate-500"
              >
                <path d="M10 5H3"></path>
                <path d="M12 19H3"></path>
                <path d="M14 3v4"></path>
                <path d="M16 17v4"></path>
                <path d="M21 12h-9"></path>
                <path d="M21 19h-5"></path>
                <path d="M21 5h-7"></path>
                <path d="M8 10v4"></path>
                <path d="M8 12H3"></path>
              </svg>
              <span>Filters</span>
            </button>
            <button className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors">
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
                data-lucide="download"
                className="lucide lucide-download h-3.5 w-3.5 text-slate-500"
              >
                <path d="M12 15V3"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <path d="m7 10 5 5 5-5"></path>
              </svg>
              <span className="">Export</span>
            </button>
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
            {appointments.filter((appointment) =>
              activeTab === "offered"
                ? appointment.status === "Offered"
                : appointment.status === "Confirmed",
            ).length === 0 ? (
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
                        No {activeTab} appointments
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {activeTab === "offered"
                          ? "You don't have any pending appointment offers at the moment."
                          : "You don't have any confirmed appointments yet."}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              appointments
                .filter((appointment) =>
                  activeTab === "offered"
                    ? appointment.status === "Offered"
                    : appointment.status === "Confirmed",
                )
                .map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50/70">
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {appointment.professional?.profilePictureUrl ? (
                          <img
                            src={appointment.professional.profilePictureUrl}
                            alt={
                              appointment.professional?.firstName +
                              " " +
                              appointment.professional?.lastName
                            }
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {appointment.professional?.firstName?.charAt(0) ||
                              "?"}
                          </div>
                        )}
                        <div className="">
                          <div className="text-xs font-medium tracking-tight text-slate-900">
                            {appointment.professional?.firstName || "Unknown"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {/* Professional ID or Specialization if available */}
                            <span>
                              ID: {appointment.professionalId.substring(0, 6)}
                            </span>
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
                      ${appointment.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleView(appointment)}
                          className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAccept(appointment)}
                          className="border-brand-dark bg-brand-dark hover:bg-brand-secondary inline-flex items-center rounded-full border px-2 py-1 text-[11px] text-white transition-colors"
                        >
                          Accept
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

      {/* View Appointment Modal */}
      {viewModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
              <h3 className="text-brand-dark text-lg font-semibold">
                Appointment Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Review the appointment information
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Professional
                </label>
                <div className="mt-2 flex items-center gap-3">
                  {selectedAppointment.professional?.profilePictureUrl ? (
                    <img
                      src={selectedAppointment.professional.profilePictureUrl}
                      alt={selectedAppointment.professional?.firstName}
                      className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
                      {selectedAppointment.professional?.firstName?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedAppointment.professional?.firstName || "Unknown"}
                    </div>
                    <div className="text-xs text-slate-500">
                      ID: {selectedAppointment.professionalId.substring(0, 8)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Start Date & Time
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {new Date(
                      selectedAppointment.startDate,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-700">
                    {new Date(selectedAppointment.startDate).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    End Date & Time
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {new Date(selectedAppointment.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-700">
                    {new Date(selectedAppointment.endDate).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Urgency
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        selectedAppointment.urgency === AppointmentUrgency.High
                          ? "border-red-200 bg-red-50 text-red-700"
                          : selectedAppointment.urgency ===
                              AppointmentUrgency.Medium
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : "border-brand-blue/40 bg-brand-blue/10 text-brand-dark"
                      }`}
                    >
                      {selectedAppointment.urgency}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Status
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {selectedAppointment.status}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Price
                </label>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  ${selectedAppointment.price.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Purpose / Notes
                </label>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedAppointment.notes || "No notes provided"}
                </p>
              </div>

              {selectedAppointment.offeredAt && (
                <div>
                  <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Offered At
                  </label>
                  <p className="mt-1 text-sm text-slate-700">
                    {new Date(selectedAppointment.offeredAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Appointment Modal */}
      {acceptModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAcceptModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
              <h3 className="text-brand-dark text-lg font-semibold">
                Confirm Appointment
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Are you sure you want to confirm this appointment?
              </p>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="text-sm text-slate-700">
                  <strong>Professional:</strong>{" "}
                  {selectedAppointment.professional?.firstName}{" "}
                  {selectedAppointment.professional?.lastName}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedAppointment.startDate).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(selectedAppointment.startDate).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Price:</strong> $
                  {selectedAppointment.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setAcceptModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle confirm
                    setAcceptModalOpen(false);
                    setSelectedAppointment(null);
                  }}
                  className="border-brand-dark bg-brand-dark hover:bg-brand-secondary flex-1 rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
