import { router } from "expo-router";
import type { SharedValue } from "react-native-reanimated";
import { AppHeader } from "@/shared/ui/app-header";
import { ROUTE_PATHS } from "@/app-composition/routes";
import { useHasUnreadNotifications } from "@/features/notifications/api";
import { useCurrentUser } from "@/features/auth/session";

interface ProfessionalAppHeaderProps {
  scrollY: SharedValue<number>;
  isOnNotifications?: boolean;
}

export function ProfessionalAppHeader({
  scrollY,
  isOnNotifications = false,
}: ProfessionalAppHeaderProps) {
  const { data: user } = useCurrentUser();
  const hasUnreadNotifications = useHasUnreadNotifications();

  return (
    <AppHeader
      scrollY={scrollY}
      profilePictureUrl={user?.profilePictureUrl}
      hasUnreadNotifications={hasUnreadNotifications}
      isOnNotifications={isOnNotifications}
      onOpenNotifications={() =>
        router.push(ROUTE_PATHS.PROFESSIONAL.NOTIFICATIONS)
      }
      onOpenProfile={() =>
        router.push(ROUTE_PATHS.PROFESSIONAL.MY_PROFILE)
      }
    />
  );
}
