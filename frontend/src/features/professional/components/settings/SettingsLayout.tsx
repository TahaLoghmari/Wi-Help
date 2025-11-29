import { useState } from "react";
import {
  Awards,
  Education,
  Experience,
  ProfileAndBio,
  Security,
  VerificationDocuments,
} from "@/features/professional";

export function SettingsLayout() {
  const [tab, setTab] = useState("Profile & Bio");
  return (
    <div className="flex w-full flex-1 flex-col gap-5 overflow-auto bg-[#fafafb] px-8 py-5 transition-all duration-200">
      <div className="flex flex-col gap-3 gap-x-3 gap-y-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="">
          <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
            Account Settings
          </h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            Manage your profile, verification documents, and security
            preferences.
          </p>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white pt-4 pr-4 pb-4 pl-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-4 text-[11px]">
          <button
            className={`${tab === "Profile & Bio" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
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
            Profile &amp; Bio
          </button>
          <button
            className={`${tab === "Verification Documents" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Verification Documents")}
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
              data-lucide="id-card"
              className={`lucide lucide-id-card h-3.5 w-3.5 ${tab === "Verification Documents" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M16 10h2"></path>
              <path d="M16 14h2"></path>
              <path d="M6.17 15a3 3 0 0 1 5.66 0"></path>
              <circle cx="9" cy="11" r="2"></circle>
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            </svg>
            Verification Documents
          </button>
          <button
            className={`${tab === "Education" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Education")}
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
              data-lucide="book-open"
              className={`lucide lucide-book-open h-3.5 w-3.5 ${tab === "Education" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M12 7v14"></path>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
            Education
          </button>
          <button
            className={`${tab === "Experience" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Experience")}
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
              data-lucide="stethoscope"
              className={`lucide lucide-stethoscope h-3.5 w-3.5 ${tab === "Experience" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M11 2v2"></path>
              <path d="M5 2v2"></path>
              <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
              <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
              <circle cx="20" cy="10" r="2"></circle>
            </svg>
            Experience
          </button>
          <button
            className={`${tab === "Awards" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
            onClick={() => setTab("Awards")}
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
              data-lucide="medal"
              className={`lucide lucide-medal h-3.5 w-3.5 ${tab === "Awards" ? "text-white" : "text-slate-500"}`}
            >
              <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
              <path d="M11 12 5.12 2.2"></path>
              <path d="m13 12 5.88-9.8"></path>
              <path d="M8 7h8"></path>
              <circle cx="12" cy="17" r="5"></circle>
              <path d="M12 18v-2h-.5"></path>
            </svg>
            Awards
          </button>

          <button
            className={`${tab === "Security" ? "bg-[#00394a] text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5`}
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
            Security
          </button>
        </div>
        {tab === "Profile & Bio" && <ProfileAndBio />}
        {tab === "Verification Documents" && <VerificationDocuments />}
        {tab === "Education" && <Education />}
        {tab === "Experience" && <Experience />}
        {tab === "Awards" && <Awards />}
        {tab === "Security" && <Security />}
      </div>
    </div>
  );
}
