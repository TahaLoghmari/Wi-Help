export function Experience() {
  return (
    <div className="space-y-3">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
          Experience
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Highlight your clinical and related work experience.
        </p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 mt-6">
        <div className="section-body space-y-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-800">
                <p className="font-medium tracking-tight">
                  Attending Cardiologist
                </p>
                <p className="text-[10px] text-slate-500">
                  Heart &amp; Vascular Center, Boston MA
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>2015 – Present</span>
                <button
                  type="button"
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                  aria-label="Edit experience"
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
                  aria-label="Delete experience"
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
            <div className="grid gap-2 text-[11px] text-slate-700 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[10px] text-slate-500">
                  Title / Role
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="Attending Cardiologist"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  Start year
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="2015"
                />
              </div>
            </div>
            <div className="grid gap-2 text-[11px] text-slate-700 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500">
                  End year
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                  value="Present"
                />
              </div>
            </div>
          </article>
          <p className="text-[10px] text-slate-400">
            Use Add to include residency, fellowships, and other relevant roles.
          </p>
        </div>
      </section>
    </div>
  );
}
