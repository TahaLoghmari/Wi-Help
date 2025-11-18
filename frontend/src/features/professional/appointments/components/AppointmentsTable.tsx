export function AppointmentsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
      <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="">
            <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
              Patient Appointments
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage upcoming and today’s appointments with quick actions.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-[11px] sm:flex">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
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
                data-lucide="sliders-horizontal"
                className="lucide lucide-sliders-horizontal h-3.5 w-3.5 text-slate-500"
              >
                <path d="M10 5H3"></path>
                <path d="M12 19H3"></path>
                <path d="M14 3v4"></path>
                <path d="M16 17v4"></path>
                <path d="M21 12h-9"></path>
                <path d="M21 19h-5"></path>
                <path d="M21 5h-7"></path>
                <path d="M8 10v4"></path>
                <path d="M8 12H3"></path>
              </svg>
              <span>Filters</span>
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
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
                data-lucide="download"
                className="lucide lucide-download h-3.5 w-3.5 text-slate-500"
              >
                <path d="M12 15V3"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <path d="m7 10 5 5 5-5"></path>
              </svg>
              <span className="">Export</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 pb-1 text-xs">
          <button
            id="appt-tab-upcoming"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-[#00394a]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3fa6ff]"></span>
            Upcoming
          </button>
          <button
            id="appt-tab-today"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-white"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300"></span>
            Today
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Patient
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Date
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Purpose
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Type
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Paid Amount
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/70">
              <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&amp;fit=crop&amp;w=200&amp;q=80"
                    alt="Patient"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="">
                    <div className="text-xs font-medium tracking-tight text-slate-900">
                      Jonathan Barnes
                    </div>
                    <div className="text-[11px] text-slate-500">
                      MRN: 003849 • 45 yrs
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                18 Nov 2025 • 09:15
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                Chest pain follow-up, medication review.
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <span className="inline-flex items-center rounded-full border border-[#3fa6ff]/40 bg-[#3fa6ff]/10 px-2 py-0.5 text-[11px] text-[#00394a]">
                  New patient
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                $220.00
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                    View
                  </button>
                  <button className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                    Accept request
                  </button>
                </div>
              </td>
            </tr>

            <tr className="hover:bg-slate-50/70">
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                    alt="Patient"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="">
                    <div className="text-xs font-medium tracking-tight text-slate-900">
                      Maria Gonzalez
                    </div>
                    <div className="text-[11px] text-slate-500">
                      MRN: 002174 • 62 yrs
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                18 Nov 2025 • 10:00
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                Post-procedure review and lab results discussion.
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <span className="inline-flex items-center rounded-full border border-[#14d3ac]/40 bg-[#14d3ac]/10 px-2 py-0.5 text-[11px] text-[#00546e]">
                  Existing patient
                </span>
              </td>
              <td className="sm:px- px-4 py-3.5 text-xs whitespace-nowrap text-slate-800">
                $180.00
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                    View
                  </button>
                  <button className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                    Accept request
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/70">
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
                    alt="Patient"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="">
                    <div className="text-xs font-medium tracking-tight text-slate-900">
                      Priya Desai
                    </div>
                    <div className="text-[11px] text-slate-500">
                      MRN: 005834 • 29 yrs
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                18 Nov 2025 • 11:00
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                Follow-up for hypertension management.
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <span className="inline-flex items-center rounded-full border border-[#14d3ac]/40 bg-[#14d3ac]/10 px-2 py-0.5 text-[11px] text-[#00546e]">
                  Existing patient
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                $130.00
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                    View
                  </button>
                  <button className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                    Accept request
                  </button>
                </div>
              </td>
            </tr>

            <tr className="hover:bg-slate-50/70">
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg"
                    alt="Patient"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="">
                    <div className="text-xs font-medium tracking-tight text-slate-900">
                      Ahmed El-Sayed
                    </div>
                    <div className="text-[11px] text-slate-500">
                      MRN: 007642 • 51 yrs
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                18 Nov 2025 • 13:30
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                Results review and treatment plan update.
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <span className="inline-flex items-center rounded-full border border-[#3fa6ff]/40 bg-[#3fa6ff]/10 px-2 py-0.5 text-[11px] text-[#00394a]">
                  New patient
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                $250.00
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                    View
                  </button>
                  <button className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                    Accept request
                  </button>
                </div>
              </td>
            </tr>

            <tr className="hover:bg-slate-50/70">
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp"
                    alt="Patient"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="">
                    <div className="text-xs font-medium tracking-tight text-slate-900">
                      Olivia Chen
                    </div>
                    <div className="text-[11px] text-slate-500">
                      MRN: 001293 • 36 yrs
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                18 Nov 2025 • 15:00
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                Routine follow-up and medication refill.
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                <span className="inline-flex items-center rounded-full border border-[#14d3ac]/40 bg-[#14d3ac]/10 px-2 py-0.5 text-[11px] text-[#00546e]">
                  Existing patient
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                $95.00
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                    View
                  </button>
                  <button className="inline-flex items-center rounded-full border border-[#00394a] bg-[#00394a] px-2 py-1 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                    Accept request
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 gap-x-3 gap-y-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
        <div className="text-[11px] text-slate-500">
          Showing
          <span className="font-medium text-slate-700">5</span>
          of
          <span className="font-medium text-slate-700">24</span>
          appointments.
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
            Previous
          </button>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00394a] text-[11px] font-medium text-white">
              1
            </span>
            <span className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
              2
            </span>
            <span className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
              3
            </span>
          </div>
          <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
