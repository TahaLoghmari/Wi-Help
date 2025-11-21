export function VerificationDocuments() {
  return (
    <div className="space-y-3">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
          Verification Documents
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Documents used to verify your professional identity. Managed by the
          compliance team.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 mt-6">
        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                data-lucide="graduation-cap"
                className="lucide lucide-graduation-cap h-3.5 w-3.5 text-slate-500"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
            </span>
            <div>
              <p className="font-medium tracking-tight text-slate-900">
                Diploma
              </p>
              <p className="text-[10px] text-slate-500">Medical degree</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Verified
          </span>
        </article>

        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                data-lucide="file-badge"
                className="lucide lucide-file-badge h-3.5 w-3.5 text-slate-500"
              >
                <path d="M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3"></path>
                <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                <path d="m7.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.879.001l-1.846.85a.5.5 0 0 1-.692-.593l1.29-4.88"></path>
                <circle cx="6" cy="14" r="3"></circle>
              </svg>
            </span>
            <div>
              <p className="font-medium tracking-tight text-slate-900">
                Professional license
              </p>
              <p className="text-[10px] text-slate-500">
                State / national license
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Verified
          </span>
        </article>

        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                data-lucide="id-card"
                className="lucide lucide-id-card h-3.5 w-3.5 text-slate-500"
              >
                <path d="M16 10h2"></path>
                <path d="M16 14h2"></path>
                <path d="M6.17 15a3 3 0 0 1 5.66 0"></path>
                <circle cx="9" cy="11" r="2"></circle>
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              </svg>
            </span>
            <div>
              <p className="font-medium tracking-tight text-slate-900">ID</p>
              <p className="text-[10px] text-slate-500">Government-issued</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Verified
          </span>
        </article>

        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                data-lucide="shield"
                className="lucide lucide-shield h-3.5 w-3.5 text-slate-500"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
            </span>
            <div>
              <p className="font-medium tracking-tight text-slate-900">
                Insurance
              </p>
              <p className="text-[10px] text-slate-500">
                Professional coverage
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        </article>
      </div>
      <p className="text-[10px] text-slate-400">
        For updates to verification documents, please contact support. This
        section is read-only.
      </p>
    </div>
  );
}
