import type { ReactNode } from "react";
import Icon1 from "@/assets/Icon-1.png";
import TextIcon from "@/assets/TextIcon .png";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-muted flex h-svh flex-col items-center gap-6 overflow-y-auto">
      <div className="my-auto flex w-full max-w-md flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center">
          <img src={Icon1} alt="" className="h-20" />
          <img src={TextIcon} alt="" className="h-20" />
        </div>
        {children}
      </div>
    </div>
  );
}
