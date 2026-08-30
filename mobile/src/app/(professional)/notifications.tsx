import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { NotificationsScreen } from "@/features/notifications";

export default function NotificationsRoute() {
  return (
    <NotificationsScreen
      renderHeader={(scrollY) => (
        <ProfessionalAppHeader scrollY={scrollY} isOnNotifications />
      )}
    />
  );
}
