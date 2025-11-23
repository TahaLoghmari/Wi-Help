import { Link } from "@tanstack/react-router";
import { getServices } from "@/features/landing-page";
import { useTranslation } from "react-i18next";

const GradientMoveRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="moveRightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3fa6ff" />
        <stop offset="100%" stop-color="#14d3ac" />
      </linearGradient>
    </defs>
    <path d="m9 18 6-6-6-6" fill="url(#moveRightGradient)" />
  </svg>
);

export function ServicesSection() {
  const { t } = useTranslation();
  const services = getServices(t);
  return (
    <div className="mb-12 flex flex-col gap-12 md:mb-20 md:gap-28">
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 md:gap-4">
        <p className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          {t("landing.services.title")}
        </p>
        <p className="text-center text-sm text-gray-600 md:text-base">
          {t("landing.services.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={idx}
              className="flex flex-col gap-4 rounded-md bg-white p-5 shadow-sm md:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] p-2">
                <Icon />
              </div>

              <p className="font-semibold">{service.title}</p>
              <p className="text-xs text-gray-600">{service.description}</p>
              <Link
                to={service.href}
                className="flex w-fit items-center gap-1 bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] bg-clip-text text-xs font-semibold text-transparent"
              >
                Learn more <GradientMoveRight />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
