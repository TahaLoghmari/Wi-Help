export function VerificationDocuments() {
  return (
    <div className="space-y-4" id="settings-panel-verification">
      <div className="mb-1 border-b border-slate-200 pb-3">
        <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
          Verification Documents
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Upload and manage the documents used to verify your professional
          identity. Updates may require compliance review.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        <article className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                  data-lucide="graduation-cap"
                  className="lucide lucide-graduation-cap h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
              </span>
              <div className="">
                <p className="font-medium tracking-tight text-slate-900">
                  Diploma
                </p>
                <p className="text-[10px] text-slate-500">Medical degree</p>
              </div>
            </div>
            <span
              data-status-badge=""
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span data-status-text="">Verified</span>
            </span>
          </div>

          <div
            data-dropzone=""
            data-input="diploma-file-input"
            className="group relative mt-1 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-4 transition-colors"
          >
            <input
              id="diploma-file-input"
              type="file"
              data-sync-label="true"
              className="sr-only"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
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
                  data-lucide="upload"
                  className="lucide lucide-upload h-3.5 w-3.5"
                >
                  <path d="M12 3v12"></path>
                  <path d="m17 8-5-5-5 5"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-medium tracking-tight text-[#00394a]">
                  Click to upload document
                </span>
                <span className="text-[10px] text-slate-500">
                  PDF up to 5 MB
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
            <span
              data-status-badge=""
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span data-status-text="">Verified</span>
            </span>
          </div>

          <div
            data-dropzone=""
            data-input="license-file-input"
            className="group relative mt-1 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-4 transition-colors"
          >
            <input
              id="license-file-input"
              type="file"
              data-sync-label="true"
              className="sr-only"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
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
                  data-lucide="upload"
                  className="lucide lucide-upload h-3.5 w-3.5"
                >
                  <path d="M12 3v12"></path>
                  <path d="m17 8-5-5-5 5"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-medium tracking-tight text-[#00394a]">
                  Click to upload document
                </span>
                <span className="text-[10px] text-slate-500">
                  PDF up to 5 MB
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
                  className="lucide lucide-id-card h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M16 10h2"></path>
                  <path d="M16 14h2"></path>
                  <path d="M6.17 15a3 3 0 0 1 5.66 0"></path>
                  <circle cx="9" cy="11" r="2"></circle>
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                </svg>
              </span>
              <div className="">
                <p className="font-medium tracking-tight text-slate-900">ID</p>
                <p className="text-[10px] text-slate-500">Government-issued</p>
              </div>
            </div>
            <span
              data-status-badge=""
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span data-status-text="">Verified</span>
            </span>
          </div>

          <div
            data-dropzone=""
            data-input="id-file-input"
            className="group relative mt-1 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-4 transition-colors"
          >
            <input
              id="id-file-input"
              type="file"
              data-sync-label="true"
              className="sr-only"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
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
                  data-lucide="upload"
                  className="lucide lucide-upload h-3.5 w-3.5"
                >
                  <path d="M12 3v12"></path>
                  <path d="m17 8-5-5-5 5"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-medium tracking-tight text-[#00394a]">
                  Click to upload document
                </span>
                <span className="text-[10px] text-slate-500">
                  PDF up to 5 MB
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
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
            <span
              data-status-badge=""
              className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-800"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span data-status-text="">Pending</span>
            </span>
          </div>

          <div
            data-dropzone=""
            data-input="insurance-file-input"
            className="group relative mt-1 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-4 transition-colors"
          >
            <input
              id="insurance-file-input"
              type="file"
              data-sync-label="true"
              className="sr-only"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
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
                  data-lucide="upload"
                  className="lucide lucide-upload h-3.5 w-3.5"
                >
                  <path d="M12 3v12"></path>
                  <path d="m17 8-5-5-5 5"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-medium tracking-tight text-[#00394a]">
                  Click to upload document
                </span>
                <span className="text-[10px] text-slate-500">
                  PDF up to 5 MB
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
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
              data-lucide="info"
              className="lucide lucide-info h-3 w-3"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </span>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Uploading a new document will reset its status to
            <span className="font-medium text-slate-700"> Pending</span>
            while our compliance team reviews the update.
          </p>
        </div>
        <p className="text-[11px] text-slate-400">
          Typical review time: 1–2 business days.
        </p>
      </div>
      <div className="flex w-full items-center justify-end">
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
  );
}
