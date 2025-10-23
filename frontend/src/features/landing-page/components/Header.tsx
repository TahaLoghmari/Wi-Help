import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "@/components/ui";
import { useTranslation } from "react-i18next";
import FullLogoHorizontal from "@/assets/FullLogoHorizontal.png";

export function Header() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-1 py-8">
      <img src={FullLogoHorizontal} alt="FullLogoHorizontal" />

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Link
          to={ROUTE_PATHS.AUTH.LOGIN}
          className="cursor-pointer font-semibold text-white transition-all duration-200 hover:bg-[#4ba78a]/80 bg-[#4ba78a] px-4 w-fit h-8 rounded-xl flex items-center justify-center"
        >
          {t("auth.signIn")}
        </Link>
      </div>
    </div>
  );
}
