import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ROUTE_PATHS } from "@/config/routes";
import Icon2 from "@/assets/Icon-2.png";

export function Navigation() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate({ to: ROUTE_PATHS.AUTH.LOGIN });
  };

  const handleBookCare = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  return (
    <nav className="bg-brand-bg/80 fixed top-0 z-50 w-full border-b border-slate-200/50 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-3">
            <img src={Icon2} alt="Logo" className="h-10" />
            <span className="text-brand-dark text-lg font-semibold tracking-tight">
              Wi-Help
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a
              href="#patients"
              className="hover:text-brand-dark transition-colors"
            >
              For Patients
            </a>
            <a
              href="#professionals"
              className="hover:text-brand-dark transition-colors"
            >
              For Professionals
            </a>
            <a
              href="#trust"
              className="hover:text-brand-dark transition-colors"
            >
              Trust &amp; Safety
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogin}
            className="hover:text-brand-dark hidden text-sm font-medium text-slate-500 transition-colors md:block"
          >
            Log in
          </button>
          <button
            onClick={handleBookCare}
            className="bg-brand-dark hover:bg-brand-secondary shadow-brand-dark/10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all"
          >
            Book Care
            <ArrowRight className="text-brand-teal h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
