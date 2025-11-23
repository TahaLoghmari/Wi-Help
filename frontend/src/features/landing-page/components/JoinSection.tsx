import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
import JoinSectionImage from "@/assets/JoinSectionImage.jpg";

const BENEFITS: string[] = [
  "Flexible scheduling and work-life balance",
  "Secure and instant payments",
  "Professional liability coverage",
  "24/7 platform support",
];

export function JoinSection() {
  return (
    <div className="my-12 flex flex-col gap-6 md:my-20 md:gap-10 lg:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-6 md:gap-8">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <p className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              Join Our Network of Healthcare Professionals
            </p>
            <p className="text-accent text-sm md:text-base">
              Expand your practice, reach more patients, and earn more with
              Wi-Help's professional platform.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {BENEFITS.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-[#63df81]"
                >
                  <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>
                <p className="text-accent text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          to={ROUTE_PATHS.AUTH.REGISTER}
          className="text-primary w-full cursor-pointer rounded-full bg-[#00e984] p-3 text-center text-xs font-bold transition-all duration-300 hover:bg-[#5fd1ab] sm:w-fit md:p-4"
        >
          Apply as Professional
        </Link>
      </div>
      <div className="w-full rounded-md lg:w-[48%]">
        <img
          src={JoinSectionImage}
          alt="JoinSectionImage"
          className="h-64 w-full rounded-md object-cover sm:h-80 md:h-100"
        />
      </div>
    </div>
  );
}
