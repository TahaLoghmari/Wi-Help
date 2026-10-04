import { router } from "expo-router";
import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { ROUTE_PATHS } from "@/app-composition/routes";
import { MoreScreen } from "@/features/professionals";

export default function ProfessionalMoreRoute() {
  return (
    <MoreScreen
      renderHeader={(scrollY) => <ProfessionalAppHeader scrollY={scrollY} />}
      onOpenProfile={() => router.push(ROUTE_PATHS.PROFESSIONAL.MY_PROFILE)}
    />
  );
}
