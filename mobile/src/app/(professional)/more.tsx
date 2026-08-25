import { router } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import { MoreScreen } from "@/features/professionals";

export default function ProfessionalMoreRoute() {
  return (
    <MoreScreen
      onOpenProfile={() => router.push(ROUTE_PATHS.PROFESSIONAL.MY_PROFILE)}
    />
  );
}
