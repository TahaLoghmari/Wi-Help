import type { ReactNode } from "react";
import OnlyTextIcon from "@/assets/OnlyTextLogo.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-muted flex h-svh flex-col items-center gap-6 overflow-y-auto">
      <div className="my-auto flex w-full max-w-md flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center justify-center">
          <img src={OnlyTextIcon} alt="" className="w-45 h-10" />
        </div>
        {children}
      </div>
    </div>
  );
}
