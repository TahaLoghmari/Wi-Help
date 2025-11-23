import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import {
  Button,
  LanguageSwitcher,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import Icon2 from "@/assets/Icon-2.png";
import { getNavigation } from "@/features/landing-page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function Header() {
  const { t } = useTranslation();
  const navigation = getNavigation(t);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="mt-1 flex items-center justify-between p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 sm:gap-5">
        <img src={Icon2} alt="Logo" className="h-8 sm:h-10" />
        <div className="flex flex-col">
          <p className="text-base font-bold sm:text-xl">Wi Help</p>
          <p className="text-muted-foreground hidden text-[10px] sm:block sm:text-xs">
            taking care of others is our priority
          </p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {navigation.map((navigation, index) => {
            return navigation.isExtandable ? (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className="text-gray-600">
                  {navigation.title}
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink className="cursor-pointer font-semibold text-gray-600">
                  {navigation.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Actions */}
      <div className="hidden items-center gap-4 lg:flex">
        <LanguageSwitcher />
        <Button asChild variant="outline" className="border-none shadow-none">
          <Link
            to={ROUTE_PATHS.AUTH.LOGIN}
            className="cursor-pointer text-sm font-semibold text-gray-800"
          >
            {t("auth.signIn")}
          </Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="cursor-pointer bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] text-sm font-semibold">
              {t("auth.signUp")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mt-[15px] flex flex-col gap-4">
            <Link
              className="group flex w-full items-center justify-between"
              to={ROUTE_PATHS.AUTH.REGISTER}
            >
              <p className="cursor-pointer text-sm font-extrabold text-gray-800 group-hover:text-gray-800/70">
                {t("common.patient")}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="none"
                className="h-5 w-5"
              >
                <defs>
                  <linearGradient
                    id="patientGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stop-color="#3fa6ff" />
                    <stop offset="100%" stop-color="#14d3ac" />
                  </linearGradient>
                </defs>
                <path
                  d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
                  fill="url(#patientGradient)"
                />
              </svg>
            </Link>
            <Link
              to={ROUTE_PATHS.AUTH.REGISTER}
              className="group flex w-full items-center justify-between"
            >
              <p className="cursor-pointer text-sm font-extrabold text-gray-800 group-hover:text-gray-800/70">
                {t("common.professional")}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="none"
                className="h-5 w-5"
              >
                <defs>
                  <linearGradient
                    id="professionalGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stop-color="#3fa6ff" />
                    <stop offset="100%" stop-color="#14d3ac" />
                  </linearGradient>
                </defs>
                <path
                  d="M720-280v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM440-120 313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 21.5t81 61.5q34-40 81-61.5t99-21.5q85 0 142.5 51.5T834-668q-18-7-36-10.5t-35-3.5q-101 0-172 70.5T520-440q0 52 21 98.5t59 79.5q-19 17-49.5 43.5T498-172l-58 52Z"
                  fill="url(#professionalGradient)"
                />
              </svg>
            </Link>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 z-50 border-t bg-white shadow-lg lg:hidden">
          <div className="flex flex-col gap-4 p-4">
            {navigation.map((nav, index) => (
              <button
                key={index}
                className="py-2 text-left font-semibold text-gray-600 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {nav.title}
              </button>
            ))}
            <div className="flex flex-col gap-3 border-t pt-4">
              <LanguageSwitcher />
              <Link
                to={ROUTE_PATHS.AUTH.LOGIN}
                className="cursor-pointer rounded-md border border-gray-200 py-2 text-center text-sm font-semibold text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("auth.signIn")}
              </Link>
              <div className="flex flex-col gap-2">
                <Link
                  to={ROUTE_PATHS.AUTH.REGISTER}
                  className="cursor-pointer rounded-md bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] px-4 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("auth.signUp")} - {t("common.patient")}
                </Link>
                <Link
                  to={ROUTE_PATHS.AUTH.REGISTER}
                  className="cursor-pointer rounded-md bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] px-4 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("auth.signUp")} - {t("common.professional")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
