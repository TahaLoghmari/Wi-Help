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

export function DashboardSidebarLogoutButton() {
  const { data: user } = useCurrentUser();
  const { isOpen, setIsOpen } = useLogoutDialogStore();
  const logoutMutation = useLogout();
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Log out of Wi Help as {user?.email}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => logoutMutation.mutate()}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
