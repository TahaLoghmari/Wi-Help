export function Security() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
      <form className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
        <div className="mb-1 border-slate-200 pb-3">
          <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
            Security
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Keep your account secure with a strong password and two-factor
            authentication.
          </p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Current password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Confirm new password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
                placeholder="Re-enter new password"
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"
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
              data-lucide="key"
              className="lucide lucide-key h-3.5 w-3.5 text-slate-500"
            >
              <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
              <path d="m21 2-9.6 9.6"></path>
              <circle cx="7.5" cy="15.5" r="5.5"></circle>
            </svg>
            Update password
          </button>
        </div>

        <div className="mt-1 space-y-3 border-t border-dashed border-slate-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
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
                className="lucide lucide-shield h-3.5 w-3.5 text-emerald-500"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
              <div>
                <p className="font-medium tracking-tight text-slate-900">
                  Two-factor authentication
                </p>
                <p className="text-[10px] text-slate-500">
                  Add an extra layer of security using SMS or an authenticator
                  app.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                className="inline-flex h-5 w-9 items-center rounded-full border border-emerald-600 bg-emerald-500/90 px-0.5"
              >
                <span className="inline-flex h-4 w-4 translate-x-4 items-center justify-center rounded-full bg-white shadow-sm"></span>
              </button>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Enabled
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
