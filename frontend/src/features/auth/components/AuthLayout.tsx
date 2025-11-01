import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import Icon2 from "@/assets/Icon-2.png";
import { ROUTE_PATHS } from "@/config/routes";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const isRegisterRoute = location.pathname.includes(ROUTE_PATHS.AUTH.REGISTER);

  return (
    <div className="bg-muted flex h-svh flex-col items-center gap-6 overflow-y-auto">
      <div
        className={`my-auto flex w-full flex-col gap-6 p-6 md:p-10 ${isRegisterRoute ? "max-w-[590px]" : "max-w-md"}`}
      >
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-5">
            <img src={Icon2} alt="Logo" className="h-10" />
            <div className="flex flex-col">
              <p className="text-xl font-bold">Wi Help</p>
              <p className="text-muted-foreground text-xs">
                taking care of others is our priority
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
