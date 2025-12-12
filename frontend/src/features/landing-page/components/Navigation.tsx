import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ROUTE_PATHS } from "@/config/routes";
import Icon2 from "@/assets/Icon-2.png";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

export function Navigation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    navigate({ to: ROUTE_PATHS.AUTH.LOGIN });
  };

  const handleBookCare = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const currentLanguage = i18n.language === "fr" ? "FR" : "EN";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  return (
    <nav className="bg-brand-bg/80 sticky top-0 z-50 w-full border-b border-slate-200/50 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-3">
            <img src={Icon2} alt="Logo" className="h-10" />
            <span className="text-brand-dark text-lg font-semibold tracking-tight">
              Wi-Help
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a
              href="#patients"
              className="hover:text-brand-dark transition-colors"
            >
              {t("navigation.forPatients")}
            </a>
            <a
              href="#professionals"
              className="hover:text-brand-dark transition-colors"
            >
              {t("navigation.forProfessionals")}
            </a>
            <a
              href="#trust"
              className="hover:text-brand-dark transition-colors"
            >
              {t("navigation.trustAndSafety")}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div ref={dropdownRef} className="relative mr-2 hidden md:block">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="hover:text-brand-dark flex items-center gap-x-1.5 gap-y-1.5 pt-2 pb-2 text-sm font-medium text-slate-500 transition-colors outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-globe h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" className=""></circle>
                <path
                  d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
                  className=""
                ></path>
                <path d="M2 12h20"></path>
              </svg>
              <span className="">{currentLanguage}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`lucide lucide-chevron-down h-3 w-3 opacity-50 transition-transform ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 z-50 pt-2">
                <div className="shadow-card min-w-[120px] overflow-hidden rounded-xl border border-slate-100 bg-white py-1">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                      i18n.language === "en"
                        ? "text-brand-teal bg-slate-50/50"
                        : "hover:text-brand-dark text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    English
                    {i18n.language === "en" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check h-3.5 w-3.5"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                      i18n.language === "fr"
                        ? "text-brand-teal bg-slate-50/50"
                        : "hover:text-brand-dark text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Français
                    {i18n.language === "fr" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check h-3.5 w-3.5"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogin}
            className="hover:text-brand-dark hidden text-sm font-medium text-slate-500 transition-colors md:block"
          >
            {t("common.login")}
          </button>
          <button
            onClick={handleBookCare}
            className="bg-brand-dark hover:bg-brand-secondary shadow-brand-dark/10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all"
          >
            {t("landing.bookCare")}
            <ArrowRight className="text-brand-teal h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
