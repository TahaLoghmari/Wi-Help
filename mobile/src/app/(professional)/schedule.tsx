import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { ScheduleScreen } from "@/features/professionals";

export default function ProfessionalScheduleRoute() {
  return (
    <ScheduleScreen
      renderHeader={(scrollY) => <ProfessionalAppHeader scrollY={scrollY} />}
    />
  );
}
