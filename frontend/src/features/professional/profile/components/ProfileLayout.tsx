export function ProfileLayout() {
  return (
    <section className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
              alt="Doctor Avatar"
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
                  Dr. Eleanor Shaw
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
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
                    data-lucide="shield-check"
                    className="lucide lucide-shield-check h-3.5 w-3.5"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cardiologist • NPI 14285739 • Heart &amp; Vascular Center,
                Boston MA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-700">
            <div className="flex items-center gap-1">
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
                data-lucide="star"
                className="lucide lucide-star h-3.5 w-3.5 text-[#f5a623]"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              <span className="font-semibold text-slate-900">4.8</span>
              <span className="text-slate-500">/ 5 • 234 reviews</span>
            </div>
            <span className="h-3 w-px bg-slate-200"></span>
            <div className="flex items-center gap-1">
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
                data-lucide="briefcase"
                className="lucide lucide-briefcase h-3.5 w-3.5 text-slate-500"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
              </svg>
              <span className="font-semibold text-slate-900">312</span>
              <span className="text-slate-500">missions completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              About &amp; Bio
            </h3>
            <p className="text-xs leading-relaxed text-slate-700">
              Dr. Shaw is a board-certified cardiologist with over{" "}
              <span className="font-semibold">12 years of experience</span> in
              preventive cardiology, complex hypertension, and heart failure
              management. She focuses on clear communication, shared decision
              making, and evidence-based care.
            </p>
            <div className="mt-3 grid gap-2 text-[11px] text-slate-700 sm:grid-cols-2">
              <div className="flex items-center gap-2">
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
                  data-lucide="stethoscope"
                  className="lucide lucide-stethoscope h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M11 2v2"></path>
                  <path d="M5 2v2"></path>
                  <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
                  <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
                  <circle cx="20" cy="10" r="2"></circle>
                </svg>
                <span>
                  <span className="text-slate-500">Specialization:</span>{" "}
                  Cardiology
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  data-lucide="briefcase"
                  className="lucide lucide-briefcase h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                </svg>
                <span>
                  <span className="text-slate-500">Experience:</span> 12 years
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  data-lucide="dollar-sign"
                  className="lucide lucide-dollar-sign h-3.5 w-3.5 text-slate-500"
                >
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>
                  <span className="text-slate-500">Hourly rate:</span> $180 /
                  hour
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                  data-lucide="shield-check"
                  className="lucide lucide-shield-check h-3.5 w-3.5 text-emerald-500"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span>
                  <span className="text-slate-500">Verification status:</span>{" "}
                  Verified
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
                Specialties &amp; Focus Areas
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700">
                Preventive Cardiology
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700">
                Heart Failure Management
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700">
                Complex Hypertension
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700">
                Geriatric Care
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700">
                Post-Op Cardiac Care
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100 sm:p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
                Patient Reviews
              </h3>
              <span className="text-[11px] text-slate-500">
                Scrollable • Most recent
              </span>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              <article className="flex gap-3 rounded-xl border border-slate-200/70 p-3">
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&amp;fit=crop&amp;w=200&amp;q=80"
                  className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                  alt="Patient"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tracking-tight text-slate-900">
                        Jonathan Barnes
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#f5a623]">
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star-half"
                          className="h-3 w-3"
                          stroke-width="1.5"
                        ></svg>
                      </span>
                    </div>
                    <span className="text-[10px] whitespace-nowrap text-slate-400">
                      2h ago
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-700">
                    Very clear explanations and I felt involved in all decisions
                    about my treatment.
                  </p>
                </div>
              </article>
              <article className="flex gap-3 rounded-xl border border-slate-200/70 p-3">
                <img
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp"
                  className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                  alt="Patient"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tracking-tight text-slate-900">
                        Olivia Chen
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#f5a623]">
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3"
                          stroke-width="1.5"
                          fill="currentColor"
                        ></svg>
                        <svg
                          data-lucide="star"
                          className="h-3 w-3 text-slate-300"
                          stroke-width="1.5"
                        ></svg>
                      </span>
                    </div>
                    <span className="text-[10px] whitespace-nowrap text-slate-400">
                      5d ago
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-700">
                    Efficient visit and thoughtful follow-up plan. I felt in
                    good hands.
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside className="col-span-1 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              Document Center
            </h3>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
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
                  Diploma
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
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
                  ID
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
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
                  Insurance
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-800">
                  Pending
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
            <h3 className="mb-2 text-xs font-semibold tracking-tight text-[#00394a]">
              Address &amp; Contact
            </h3>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-start gap-2">
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
                  data-lucide="home"
                  className="lucide lucide-home mt-0.5 h-3.5 w-3.5 text-slate-500"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <div>
                  <p className="text-[10px] text-slate-500">Practice address</p>
                  <p className="font-medium tracking-tight text-slate-900">
                    Heart &amp; Vascular Center, Suite 402
                    <br />
                    Boston, MA 02114
                    <br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                  data-lucide="mail"
                  className="lucide lucide-mail h-3.5 w-3.5 text-slate-500"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                </svg>
                <span>eleanor.shaw@exampleclinic.com</span>
              </div>
              <div className="flex items-center gap-2">
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
                <span>Gender: Female • DOB: 1981-06-14</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

{
  /* <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
  <div className="mb-2 flex items-center justify-between">
    <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
      Status &amp; Availability
    </h3>
  </div>
  <div className="mb-3 flex items-center justify-between">
    <span className="flex items-center gap-2 text-[11px] text-slate-700">
      <span className="inline-flex h-5 w-9 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-0.5">
        <span className="inline-flex h-4 w-4 translate-x-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm"></span>
      </span>
      <span className="font-medium text-slate-900">Go Online</span>
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      Active
    </span>
  </div>
  <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-700">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="calendar-clock"
          className="h-3.5 w-3.5 text-slate-500"
          stroke-width="1.5"
        ></svg>
        Weekly Availability
      </span>
      <span className="text-[10px] text-slate-500">Mon–Fri • 09:00–17:00</span>
    </div>
    <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Mon
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Tue
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Wed
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Thu
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Fri
      </span>
    </div>
  </div>

  <div className="space-y-2 text-[11px] text-slate-700">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="map-pin"
          className="h-3.5 w-3.5 text-slate-500"
          stroke-width="1.5"
        ></svg>
        Service area
      </span>
      <span className="text-slate-500">
        Within <span className="font-semibold text-slate-900">10 km</span>
      </span>
    </div>
    <div className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
      Map preview
    </div>
  </div>
</section>; */
}
