import { useCurrentUser } from "@/features/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogoutDialogStore } from "@/features/dashboard";
import { useLogout } from "@/features/auth";
import { useTranslation } from "react-i18next";

export function DashboardSidebarLogoutButton() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const { isOpen, setIsOpen } = useLogoutDialogStore();
  const logoutMutation = useLogout();
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("dashboard.sidebar.logout.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dashboard.sidebar.logout.description", { email: user?.email })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("dashboard.sidebar.logout.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => logoutMutation.mutate()}>
            {t("dashboard.sidebar.logout.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
