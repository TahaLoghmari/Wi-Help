import { Link } from "@tanstack/react-router";
import { SERVICES } from "@/features/landing-page";

const GradientMoveRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="moveRightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3fa6ff" />
        <stop offset="100%" stop-color="#14d3ac" />
      </linearGradient>
    </defs>
    <path d="m9 18 6-6-6-6" fill="url(#moveRightGradient)" />
  </svg>
);

export function ServicesSection() {
  return (
    <div className="mb-20 flex flex-col gap-28">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <p className="text-4xl font-bold">Our Healthcare Services</p>
        <p className="text-center text-gray-600">
          Professional healthcare services delivered to your home <br />
          by verified medical professionals
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {SERVICES.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={idx}
              className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] p-2">
                <Icon />
              </div>

              <p className="font-semibold">{service.title}</p>
              <p className="text-xs text-gray-600">{service.description}</p>
              <Link
                to={service.href}
                className="flex w-fit items-center gap-1 bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] bg-clip-text text-xs font-semibold text-transparent"
              >
                Learn more <GradientMoveRight />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
