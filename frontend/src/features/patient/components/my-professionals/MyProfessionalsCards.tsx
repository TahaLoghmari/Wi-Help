import { GetPatientProfessionals } from "@/features/patient";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components";

export function MyProfessionalsCards() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetPatientProfessionals();

  const professionals = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading professionals.
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        No professionals found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {professionals.map((professional, index) => (
        <article
          key={index}
          className="hover:border-brand-blue/70 flex h-45 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:shadow-md hover:shadow-slate-100"
        >
          <div className="items:center flex gap-3">
            <img
              src={professional.profilePictureUrl}
              alt="Professional"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-xs font-medium tracking-tight text-slate-900">
                  Dr. {professional.firstName} {professional.lastName}
                </h4>
                {professional.isVerified && (
                  <span className="border-brand-teal/30 bg-brand-teal/10 text-brand-teal inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-0.5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {professional.specialization} • {professional.experience} yrs
                exp
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
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
                className="lucide lucide-map-pin h-3.5 w-3.5 text-slate-400"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="truncate">
                {professional.address?.city || "Unknown"},{" "}
                {professional.address?.state || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
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
                className="lucide lucide-banknote h-3.5 w-3.5 text-slate-400"
              >
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
              <span className="">
                ${professional.startPrice} - ${professional.endPrice}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-[11px] text-slate-500">
            <span className="">
              {professional.services?.slice(0, 2).join(", ") || "General Care"}
            </span>
            <span className={`text-brand-teal inline-flex items-center gap-1`}>
              <span className={`bg-brand-teal h-1.5 w-1.5 rounded-full`}></span>
              Available
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-colors">
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
                data-lucide="message-circle"
                className="lucide lucide-message-circle h-3.5 w-3.5 text-slate-500"
              >
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
              </svg>
              Message
            </button>
            <button
              onClick={() =>
                navigate({
                  to: "/patient/professional/$professionalId",
                  params: { professionalId: professional.id },
                })
              }
              className="bg-brand-dark hover:bg-brand-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] text-white transition-colors"
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
                className="lucide lucide-user h-3.5 w-3.5 text-white"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              View Profile
            </button>
          </div>
        </article>
      ))}

      <div className="col-span-full mt-4 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          Showing
          <span className="font-medium text-slate-700">
            {" "}
            {professionals.length}{" "}
          </span>
          of
          <span className="font-medium text-slate-700"> {totalCount} </span>
          professionals.
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "No more professionals"}
          </button>
        </div>
      </div>
    </div>
  );
}
