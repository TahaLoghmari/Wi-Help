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
    <div className="my-20 flex gap-10">
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <p className="text-4xl font-semibold text-white">
              Join Our Network of Healthcare Professionals
            </p>
            <p className="text-accent">
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
                  className="h-4 w-4 text-[#63df81]"
                >
                  <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>
                <p className="text-accent text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          to={ROUTE_PATHS.AUTH.REGISTER_PROFESSIONAL}
          className="text-primary w-fit cursor-pointer rounded-full bg-[#00e984] p-4 text-xs font-bold transition-all duration-300 hover:bg-[#5fd1ab]"
        >
          Apply as Professional
        </Link>
      </div>
      <div className="w-[48%] rounded-md">
        <img
          src={JoinSectionImage}
          alt="JoinSectionImage"
          className="h-100 w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}
