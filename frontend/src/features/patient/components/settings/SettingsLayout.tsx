import { useState } from "react";
import { ProfileAndBio, Security } from "@/features/patient";
import { useTranslation } from "react-i18next";

export function SettingsLayout() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Profile & Bio");
  return (
    <div className="flex w-full flex-1 flex-col gap-5 overflow-auto bg-[#fafafb] px-8 py-5 transition-all duration-200">
      <div className="flex flex-col gap-3 gap-x-3 gap-y-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="">
          <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
            {t("patient.settings.title")}
          </h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            {t("patient.settings.subtitle")}
          </p>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white pt-4 pr-4 pb-4 pl-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-4 text-[11px]">
          <button
            className={`${tab === "Profile & Bio" ? "bg-brand-dark text-white" : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Profile & Bio")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="user"
              className={`lucide lucide-user h-3.5 w-3.5 ${tab === "Profile & Bio" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {t("patient.settings.tabs.profile")}
          </button>
          <button
            className={`${tab === "Security" ? "bg-brand-dark text-white" : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border border-slate-200 bg-white text-slate-700"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Security")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="shield"
              className={`lucide lucide-shield h-3.5 w-3.5 ${tab === "Security" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>
            {t("patient.settings.tabs.security")}
          </button>
        </div>
        {tab === "Profile & Bio" && <ProfileAndBio />}
        {tab === "Security" && <Security />}
      </div>
    </div>
  );
}
