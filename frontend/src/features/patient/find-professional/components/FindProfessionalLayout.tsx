import { FindProfessionalFilterbar } from "@/features/patient";
import { useProfessionals } from "@/features/professional";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Calendar, CalendarPlus, MapPin, Star, User } from "lucide-react";
import { SPECIALIZATIONS } from "@/features/auth";

export function FindProfessionalLayout() {
  const { data: professionals } = useProfessionals();
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <FindProfessionalFilterbar />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
            Professionals
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Showing nurses, physiotherapists, and caregivers..
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-500">Sort by</span>
          <div className="relative">
            <select className="appearance-none rounded-full border border-slate-200 bg-white px-3 py-1.5 pr-7 text-[11px] text-slate-700 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none">
              <option>Recommended</option>
              <option>Highest rating</option>
              <option>Soonest availability</option>
              <option>Lowest price</option>
            </select>
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
              className="lucide lucide-chevron-down pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {professionals?.map((professional) => (
          <article
            key={professional.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 transition-all hover:border-[#3fa6ff]/70 hover:shadow-md hover:shadow-slate-100"
          >
            <div className="flex w-full items-center justify-center">
              <Avatar className="mt-5 h-60 w-[90%] rounded-md border">
                <AvatarImage
                  src={professional.profilePictureUrl}
                  className="object-cover"
                  alt={professional.firstName}
                />
                <AvatarFallback className="rounded-none">
                  {professional.firstName.charAt(0).toUpperCase()}
                  {professional.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-xs font-medium tracking-tight text-slate-900">
                    {professional.firstName} {professional.lastName}
                  </h3>
                  {professional.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      Pending
                    </span>
                  )}
                </div>
                <p className="truncate text-[11px] text-slate-500">
                  {
                    SPECIALIZATIONS.find(
                      (specialization) =>
                        specialization.value === professional.specialization,
                    )?.label
                  }
                </p>
              </div>

              <div className="flex flex-col gap-2 text-[11px]">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-current text-[#f5a623]"
                    />
                  ))}
                  <span className="ml-1 text-slate-400">(132)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {professional.address.city}, {professional.address.state}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="truncate">Available on Fri, 23 Nov</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-lucide="dollar-sign"
                    className="lucide lucide-dollar-sign h-3.5 w-3.5 text-slate-500"
                  >
                    <path d="M176 176C176 211.3 147.3 240 112 240L112 400C147.3 400 176 428.7 176 464L464 464C464 428.7 492.7 400 528 400L528 240C492.7 240 464 211.3 464 176L176 176zM64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM320 208C381.9 208 432 258.1 432 320C432 381.9 381.9 432 320 432C258.1 432 208 381.9 208 320C208 258.1 258.1 208 320 208zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" />
                  </svg>
                  <span className="font-semibold">
                    ${professional?.startPrice}
                    {"  "}-{"  "}${professional?.endPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#00394a] px-2 py-1.5 text-[11px] text-white transition-colors hover:bg-[#00546e]">
                  <CalendarPlus className="h-3.5 w-3.5 text-white" />
                  Book
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  View Profile
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
