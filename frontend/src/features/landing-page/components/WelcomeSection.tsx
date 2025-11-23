import WelcomeSectionImage from "@/assets/WelcomeSectionImage.jpg";
import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function WelcomeSection() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 lg:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-4 md:gap-6">
          <p className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {t("landing.welcome.titlePrefix")}{" "}
            <span className="text-[#00e984]">
              {t("landing.welcome.titleHighlight")}
            </span>{" "}
            {t("landing.welcome.titleSuffix")}
          </p>
          <p className="text-accent text-sm md:text-base">
            {t("landing.welcome.subtitle")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row md:gap-4">
          <Link
            to={ROUTE_PATHS.AUTH.REGISTER}
            className="text-primary w-full cursor-pointer rounded-full border-2 border-[#00e984] bg-[#00e984] p-3 text-center text-xs font-bold transition-all duration-300 hover:border-[#5fd1ab] hover:bg-[#5fd1ab] sm:w-auto md:p-4"
          >
            {t("landing.welcome.bookCare")}
          </Link>
          <Link
            to={ROUTE_PATHS.AUTH.REGISTER}
            className="hover:text-primary w-full cursor-pointer rounded-full border-2 p-3 text-center text-xs font-bold text-white transition-all duration-300 hover:bg-white sm:w-auto md:p-4"
          >
            {t("landing.welcome.joinProfessional")}
          </Link>
        </div>
      </div>
      <div className="w-full rounded-md bg-[#30566b] p-3 md:p-4 lg:w-[48%]">
        <img
          src={WelcomeSectionImage}
          alt="WelcomeSectionImage"
          className="h-64 w-full rounded-md object-cover sm:h-80 md:h-100"
        />
      </div>
    </div>
  );
}
