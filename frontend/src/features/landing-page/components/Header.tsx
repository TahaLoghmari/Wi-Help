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
import OnlyTextLogo from "@/assets/OnlyTextLogo.png";
import { getNavigation } from "@/features/landing-page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const { t } = useTranslation();
  const navigation = getNavigation(t);

  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border p-4 shadow-sm">
      <img src={OnlyTextLogo} alt="Logo" className="h-10 w-45" />
      <NavigationMenu>
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
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button asChild variant="outline">
          <Link
            to={ROUTE_PATHS.AUTH.LOGIN}
            className="cursor-pointer text-sm font-semibold text-gray-800"
          >
            {t("auth.signIn")}
          </Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="cursor-pointer bg-[#386d52]! text-sm font-semibold text-white hover:bg-[#386d52]/80!">
              {t("auth.signUp")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mt-[15px] flex flex-col gap-4">
            <Link
              className="group flex w-full items-center justify-between"
              to={ROUTE_PATHS.AUTH.REGISTER_PATIENT}
            >
              <p className="cursor-pointer text-lg font-extrabold text-gray-800 group-hover:text-gray-800/70">
                {t("common.patient")}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="h-5 w-5 text-[#386d52]"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
              </svg>
            </Link>
            <Link
              to={ROUTE_PATHS.AUTH.REGISTER_PROFESSIONAL}
              className="group flex w-full items-center justify-between"
            >
              <p className="cursor-pointer text-lg font-extrabold text-gray-800 group-hover:text-gray-800/70">
                {t("common.professional")}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="h-5 w-5 text-[#386d52]"
              >
                <path d="M720-280v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM440-120 313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 21.5t81 61.5q34-40 81-61.5t99-21.5q85 0 142.5 51.5T834-668q-18-7-36-10.5t-35-3.5q-101 0-172 70.5T520-440q0 52 21 98.5t59 79.5q-19 17-49.5 43.5T498-172l-58 52Z" />
              </svg>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
