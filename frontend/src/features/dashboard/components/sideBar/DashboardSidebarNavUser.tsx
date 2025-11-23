import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useActiveNavigationPageStore,
  useDashboardSidebarStateStore,
  useLogoutDialogStore,
} from "@/features/dashboard";
import { useCurrentScreenSize } from "@/hooks";
import { Link } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import type { UserDto } from "@/features/auth";
import { useEffect } from "react";

interface DashboardSidebarNavUserProps {
  user: UserDto;
}

export function DashboardSidebarNavUser({
  user,
}: DashboardSidebarNavUserProps) {
  const { setActiveNavigationPage } = useActiveNavigationPageStore();
  const { currentScreenSize } = useCurrentScreenSize();
  const isMobile = currentScreenSize < 768;
  const { setIsOpen } = useLogoutDialogStore();
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  return (
    <div className="border-t p-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className={`hover:bg-sidebar-accent flex items-center gap-2 ${isSidebarOpen ? "p-2" : "p-0"} `}
        >
          <div>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                className="object-cover"
                src={user?.profilePictureUrl}
                alt={user?.firstName}
              />
              <AvatarFallback className="rounded-lg">
                {user?.firstName && user?.lastName
                  ? user.firstName.charAt(0).toUpperCase() +
                    user.lastName.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  className="object-cover"
                  src={user?.profilePictureUrl}
                  alt={user?.firstName}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.firstName && user?.lastName
                    ? user.firstName.charAt(0).toUpperCase() +
                      user.lastName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                to={
                  user.role.toLowerCase() === "professional"
                    ? ROUTE_PATHS.PROFESSIONAL.PROFILE
                    : ROUTE_PATHS.PATIENT.PROFILE
                }
              >
                {({ isActive }) => {
                  useEffect(() => {
                    if (isActive) {
                      setActiveNavigationPage("Profile Overview");
                    }
                  }, [isActive]);
                  return (
                    <>
                      <IconUserCircle />
                      Profile
                    </>
                  );
                }}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
