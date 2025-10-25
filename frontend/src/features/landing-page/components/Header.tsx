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
import { NAVIGATION } from "@/features/landing-page";

export function Header() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm mt-6">
      <img src={OnlyTextLogo} alt="Logo" className="w-45 h-10" />
      <NavigationMenu>
        <NavigationMenuList>
          {NAVIGATION.map((navigation) => {
            return navigation.isExtandable ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600">
                  {navigation.title}
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink className="font-semibold cursor-pointer text-gray-600">
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
            className="cursor-pointer font-semibold text-gray-800 text-sm"
          >
            {t("auth.signIn")}
          </Link>
        </Button>
        <Button asChild>
          <Link
            to={ROUTE_PATHS.AUTH.REGISTER}
            className="cursor-pointer font-semibold text-white text-sm hover:bg-[#386d52]/80! bg-[#386d52]!"
          >
            {t("auth.signUp")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
