import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  const currentLanguage =
    i18n.language === "en" ? t("language.english") : t("language.french");

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      title={t("language.changeLanguage")}
    >
      <Globe className="h-4 w-4" />
      <span>{currentLanguage}</span>
    </Button>
  );
}
