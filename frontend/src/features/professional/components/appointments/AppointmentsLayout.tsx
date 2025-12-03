import { useMemo } from "react";
import {
  AppointmentsStat,
  AppointmentsTable,
  TodayPatientsStat,
  TotalPatientsStat,
  GetProfessionalAppointments,
  GetProfessionalPatients,
} from "@/features/professional";

export function AppointmentsLayout() {
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    GetProfessionalAppointments();
  const { data: patientsData, isLoading: patientsLoading } =
    GetProfessionalPatients();

  const stats = useMemo(() => {
    const appointments =
      appointmentsData?.pages.flatMap((page) => page.items) || [];
    const totalPatients = patientsData?.pages[0]?.totalCount || 0;

    // Get today's date in local timezone
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.startDate);
      // Normalize to local date for comparison
      const aptLocalDate = new Date(
        aptDate.getFullYear(),
        aptDate.getMonth(),
        aptDate.getDate(),
      );
      return aptLocalDate.getTime() === todayStart.getTime();
    });

    const confirmedAppointments = appointments.filter(
      (apt) => apt.status === "Confirmed",
    );
    const offeredAppointments = appointments.filter(
      (apt) => apt.status === "Offered",
    );

    const todayConfirmed = todayAppointments.filter(
      (apt) => apt.status === "Confirmed",
    );
    const todayPending = todayAppointments.filter(
      (apt) => apt.status === "Offered",
    );

    return {
      totalPatients,
      totalAppointments: appointments.length,
      confirmedCount: confirmedAppointments.length,
      offeredCount: offeredAppointments.length,
      todayAppointments: todayAppointments.length,
      todayConfirmed: todayConfirmed.length,
      todayPending: todayPending.length,
    };
  }, [appointmentsData, patientsData]);

  const isLoading = appointmentsLoading || patientsLoading;

  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <div className="grid grid-cols-3 gap-4">
        <TotalPatientsStat
          totalPatients={stats.totalPatients}
          isLoading={isLoading}
        />
        <TodayPatientsStat
          todayAppointments={stats.todayAppointments}
          confirmedCount={stats.todayConfirmed}
          pendingCount={stats.todayPending}
          isLoading={isLoading}
        />
        <AppointmentsStat
          totalAppointments={stats.totalAppointments}
          confirmedCount={stats.confirmedCount}
          offeredCount={stats.offeredCount}
          isLoading={isLoading}
        />
      </div>
      <AppointmentsTable />
    </div>
  );
}
