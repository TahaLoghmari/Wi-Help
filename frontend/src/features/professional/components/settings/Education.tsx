export function Education() {
  return (
    <div className="space-y-3">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
          Education
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Add your medical education and training history.
        </p>
      </div>
      <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-2 gap-x-2 gap-y-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-[11px] text-[#00394a] transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-lucide="plus"
              className="lucide lucide-plus h-3.5 w-3.5"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Add education
          </button>
        </div>
        <div className="section-body space-y-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 pt-3 pr-3 pb-3 pl-3 sm:p-3.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="truncate font-medium tracking-tight text-slate-900">
                    Harvard Medical School
                  </span>
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <span className="truncate text-slate-500">
                    MD, United States
                  </span>
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-0.5 text-[10px] text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-lucide="calendar"
                    className="lucide lucide-calendar h-3 w-3"
                  >
                    <path d="M8 2v2"></path>
                    <path d="M16 2v2"></path>
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>2008 – 2012</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-500">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-1.5 py-1 text-slate-600 transition-colors hover:bg-slate-100/80"
                  aria-label="Edit education"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-lucide="pencil"
                    className="lucide lucide-pencil h-3 w-3"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-rose-100 bg-white px-1.5 py-1 text-rose-500 transition-colors hover:bg-rose-50"
                  aria-label="Delete education"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-lucide="trash-2"
                    className="lucide lucide-trash-2 h-3 w-3"
                  >
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid gap-2 text-[11px] text-slate-700 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  University name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="Harvard Medical School"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Degree
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="MD"
                />
              </div>
            </div>
            <div className="grid gap-2 text-[11px] text-slate-700 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="United States"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Start date
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  placeholder="YYYY or MM/YYYY"
                  value="2008"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  End date
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  placeholder="YYYY or MM/YYYY"
                  value="2012"
                />
              </div>
            </div>
          </article>
          <div className="flex w-full items-center justify-between mt-6">
            <p className="text-[10px] text-slate-400">
              Use the Add button to include additional degrees or training
              programs.
            </p>
            <button
              className="inline-flex items-center gap-1.5 rounded-full bg-[#00394a] px-3 py-1.5 text-[11px] text-white transition-colors hover:bg-[#00546e]"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-lucide="save"
                className="lucide lucide-save h-3.5 w-3.5 text-white"
              >
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
              </svg>
              Save changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
