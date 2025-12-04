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

    // Total counts by status
    const confirmedAppointments = appointments.filter(
      (apt) => apt.status === "Confirmed",
    );
    const offeredAppointments = appointments.filter(
      (apt) => apt.status === "Offered",
    );
    const cancelledAppointments = appointments.filter(
      (apt) => apt.status === "Cancelled",
    );
    const completedAppointments = appointments.filter(
      (apt) => apt.status === "Completed",
    );

    // Today's counts by status
    const todayConfirmed = todayAppointments.filter(
      (apt) => apt.status === "Confirmed",
    );
    const todayOffered = todayAppointments.filter(
      (apt) => apt.status === "Offered",
    );
    const todayCancelled = todayAppointments.filter(
      (apt) => apt.status === "Cancelled",
    );
    const todayCompleted = todayAppointments.filter(
      (apt) => apt.status === "Completed",
    );

    return {
      totalPatients,
      totalAppointments: appointments.length,
      confirmedCount: confirmedAppointments.length,
      offeredCount: offeredAppointments.length,
      cancelledCount: cancelledAppointments.length,
      completedCount: completedAppointments.length,
      todayAppointments: todayAppointments.length,
      todayConfirmed: todayConfirmed.length,
      todayOffered: todayOffered.length,
      todayCancelled: todayCancelled.length,
      todayCompleted: todayCompleted.length,
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
          offeredCount={stats.todayOffered}
          cancelledCount={stats.todayCancelled}
          completedCount={stats.todayCompleted}
          isLoading={isLoading}
        />
        <AppointmentsStat
          totalAppointments={stats.totalAppointments}
          confirmedCount={stats.confirmedCount}
          offeredCount={stats.offeredCount}
          cancelledCount={stats.cancelledCount}
          completedCount={stats.completedCount}
          isLoading={isLoading}
        />
      </div>
      <AppointmentsTable />
    </div>
  );
}
