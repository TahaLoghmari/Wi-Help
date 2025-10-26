import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import OnlyTextIcon from "@/assets/OnlyTextLogo.png";
import { ROUTE_PATHS } from "@/config/routes";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const isRegisterRoute =
    location.pathname.includes(ROUTE_PATHS.AUTH.REGISTER_PROFESSIONAL) ||
    location.pathname.includes(ROUTE_PATHS.AUTH.REGISTER_PATIENT);

  return (
    <div className="bg-muted flex h-svh flex-col items-center gap-6 overflow-y-auto">
      <div
        className={`my-auto flex w-full flex-col gap-6 p-6 md:p-10 ${isRegisterRoute ? "max-w-[580px]" : "max-w-md"}`}
      >
        <div className="flex items-center justify-center">
          <img src={OnlyTextIcon} alt="" className="w-45 h-10" />
        </div>
        {children}
      </div>
    </div>
  );
}
