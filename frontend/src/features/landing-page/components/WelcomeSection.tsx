import WelcomeSectionImage from "@/assets/WelcomeSectionImage.jpg";
import { ROUTE_PATHS } from "@/config/routes";
import { Link } from "@tanstack/react-router";
export function WelcomeSection() {
  return (
    <div className="flex gap-10 items-center">
      <div className="flex flex-1 flex-col justify-between gap-6">
        <div className="flex flex-col gap-6">
          <p className="text-6xl font-semibold text-white">
            Professional <span className="text-[#00e984]">Healthcare</span> at
            Your Doorstep
          </p>
          <p className="text-accent">
            Connect with verified nurses, physiotherapists, and caregivers in
            Tunisia. Quality home care when you need it most.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTE_PATHS.AUTH.REGISTER_PATIENT}
            className="text-primary cursor-pointer rounded-full border-2 border-[#00e984] bg-[#00e984] p-4 text-xs font-bold transition-all duration-300 hover:border-[#5fd1ab] hover:bg-[#5fd1ab]"
          >
            Book Care Now
          </Link>
          <Link
            to={ROUTE_PATHS.AUTH.REGISTER_PROFESSIONAL}
            className="hover:text-primary cursor-pointer rounded-full border-2 p-4 text-xs font-bold text-white transition-all duration-300 hover:bg-white"
          >
            Join as Professional
          </Link>
        </div>
      </div>
      <div className="w-[48%] rounded-md bg-[#30566b] p-4">
        <img
          src={WelcomeSectionImage}
          alt="WelcomeSectionImage"
          className="h-100 w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}
