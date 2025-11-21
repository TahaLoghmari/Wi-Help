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
      <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 mt-6">
        <div className="section-body space-y-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-800">
                <p className="font-medium tracking-tight">
                  Harvard Medical School
                </p>
                <p className="text-[10px] text-slate-500">MD • United States</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>2008 – 2012</span>
                <button
                  type="button"
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
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
                    className="lucide lucide-pencil h-3.5 w-3.5"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded-full p-1 text-rose-500 hover:bg-rose-50"
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
                    className="lucide lucide-trash-2 h-3.5 w-3.5"
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
                  University
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="Harvard Medical School"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Degree
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="United States"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Start year
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="2008"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  End year
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="2012"
                />
              </div>
            </div>
          </article>
          <p className="text-[10px] text-slate-400">
            Use the Add button to include additional degrees or training
            programs.
          </p>
        </div>
      </section>
    </div>
  );
}
