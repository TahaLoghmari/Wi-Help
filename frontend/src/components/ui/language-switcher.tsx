import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import FranecIcon from "@/assets/france.png";
import UnitedStatesIcon from "@/assets/unitedStates.png";

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
      onClick={toggleLanguage}
      className="gap-2 text-sm cursor-pointer"
      title={t("language.changeLanguage")}
    >
      {currentLanguage === "FR" ? (
        <img src={FranecIcon} className="h-4 w-4" />
      ) : (
        <img src={UnitedStatesIcon} className="h-4 w-4" />
      )}
      <span>{currentLanguage}</span>
    </Button>
  );
}
