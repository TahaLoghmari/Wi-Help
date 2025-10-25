import type { TFunction } from "i18next";

export const getNavigation = (t: TFunction) => [
  {
    title: t("random.aboutYou"),
    href: "#",
    isExtandable: false,
  },
  {
    title: t("random.services"),
    href: "#",
    isExtandable: true,
  },
  {
    title: t("random.functionalities"),
    href: "#",
    isExtandable: true,
  },
];
