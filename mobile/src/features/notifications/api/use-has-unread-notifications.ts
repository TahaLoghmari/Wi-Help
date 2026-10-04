import { useNotifications } from "./get-notifications";
import { hasUnreadNotifications } from "./notification-cache";

export function useHasUnreadNotifications() {
  return hasUnreadNotifications(useNotifications().data);
}
