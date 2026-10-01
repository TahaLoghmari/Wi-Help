import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.slice(0, 2) ?? "en";
  const toggleLang = () => {
    const next = currentLang === "en" ? "fr" : "en";
    void i18n.changeLanguage(next);
  };

  return (
    <Pressable
      className={clsx(
        "flex-row items-center gap-x-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5",
        className,
      )}
      onPress={toggleLang}
      accessibilityLabel="Switch language"
      accessibilityRole="button"
    >
      <Ionicons name="globe-outline" size={15} color="#00546e" />
      <Text className="text-sm font-medium text-brand-secondary">
        {currentLang === "en" ? "FR" : "EN"}
      </Text>
    </Pressable>
  );
}
