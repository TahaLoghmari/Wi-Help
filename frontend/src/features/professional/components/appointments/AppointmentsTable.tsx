import { useState } from "react";
import {
  AppointmentUrgency,
  GetProfessionalAppointments,
  type GetProfessionalAppointmentsDto,
} from "@/features/professional";

export function AppointmentsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetProfessionalAppointments();

  const appointments = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  console.log(appointments);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetProfessionalAppointmentsDto | null>(null);

  const handleView = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleAccept = (appointment: GetProfessionalAppointmentsDto) => {
    setSelectedAppointment(appointment);
    setAcceptModalOpen(true);
  };

  const handleConfirmAppointment = () => {
    // TODO: Call backend API to accept the appointment
    console.log("Accepting appointment:", selectedAppointment?.id);
    setAcceptModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleRejectAppointment = () => {
    // TODO: Call backend API to reject the appointment
    console.log("Rejecting appointment:", selectedAppointment?.id);
    setAcceptModalOpen(false);
    setSelectedAppointment(null);
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
            <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
              Patient Appointments
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage upcoming and today’s appointments with quick actions.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-[11px] sm:flex">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
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
            <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
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
            id="appt-tab-upcoming"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-[#00394a]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3fa6ff]"></span>
            Upcoming
          </button>
          <button
            id="appt-tab-today"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-white"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300"></span>
            Today
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
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
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-slate-50/70">
                <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                  <div className="flex items-center gap-3">
                    {appointment.patient?.profilePictureUrl ? (
                      <img
                        src={appointment.patient.profilePictureUrl}
                        alt={appointment.patient.firstName}
                        className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                        {appointment.patient?.firstName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="">
                      <div className="text-xs font-medium tracking-tight text-slate-900">
                        {appointment.patient?.firstName || 'Unknown Patient'}
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
                            Patient ID: {appointment.patientId.substring(0, 6)}
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
                          : "border-[#3fa6ff]/40 bg-[#3fa6ff]/10 text-[#00394a]"
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
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAccept(appointment)}
                      className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]"
                    >
                      Accept
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 disabled:cursor-not-allowed disabled:opacity-50"
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
              <h3 className="text-lg font-semibold text-[#00394a]">
                Appointment Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Review the appointment information
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Patient
                </label>
                <div className="mt-2 flex items-center gap-3">
                  {selectedAppointment.patient?.profilePictureUrl ? (
                    <img
                      src={selectedAppointment.patient.profilePictureUrl}
                      alt={selectedAppointment.patient.firstName}
                      className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
                      {selectedAppointment.patient?.firstName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedAppointment.patient?.firstName || 'Unknown Patient'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {selectedAppointment.patient?.dateOfBirth
                        ? `DOB: ${new Date(selectedAppointment.patient.dateOfBirth).toLocaleDateString()}`
                        : `Patient ID: ${selectedAppointment.patientId.substring(0, 8)}`}
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
                        selectedAppointment.urgency === "High"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : selectedAppointment.urgency ===
                              AppointmentUrgency.Medium
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : "border-[#3fa6ff]/40 bg-[#3fa6ff]/10 text-[#00394a]"
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
              <h3 className="text-lg font-semibold text-[#00394a]">
                Confirm Appointment
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose an action for this appointment
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                  {selectedAppointment.patient?.profilePictureUrl ? (
                    <img
                      src={selectedAppointment.patient.profilePictureUrl}
                      alt={selectedAppointment.patient.firstName}
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-500">
                      {selectedAppointment.patient?.firstName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {selectedAppointment.patient?.firstName || 'Unknown Patient'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(
                        selectedAppointment.startDate,
                      ).toLocaleDateString()}{" "}
                      •{" "}
                      {new Date(
                        selectedAppointment.startDate,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  {selectedAppointment.notes ? (
                    <>
                      <span className="font-medium">Notes:</span>{" "}
                      {selectedAppointment.notes}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Notes:</span> No notes
                      provided
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <p>Would you like to accept or reject this appointment?</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
              <button
                onClick={handleRejectAppointment}
                className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={handleConfirmAppointment}
                className="flex-1 rounded-lg border border-[#00394a] bg-[#00394a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00546e]"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
