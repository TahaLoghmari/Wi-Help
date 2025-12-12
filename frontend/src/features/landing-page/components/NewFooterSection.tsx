import { useState } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import Icon2 from "@/assets/Icon-2.png";
import { Link } from "@tanstack/react-router";

export function NewFooterSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-brand-bg pt-8 pb-12 sm:px-8">
      <div className="bg-brand-dark relative overflow-hidden rounded-[2.5rem] border border-black/5">
        <div className="relative z-10 pt-8 pr-4 pb-8 pl-4 sm:p-12">
          <div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-4">
            <div className="lg:col-span-4">
              <Link to="/" className="group flex items-center gap-3 mb-4">
                <img src={Icon2} alt="Logo" className="h-10" />
                <span className="text-white text-lg font-semibold tracking-tight">
                  Wi-Help
                </span>
              </Link>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                {/* Newsletter Column */}
                <div className="space-y-6">
                  <div className="bg-brand-teal/10 text-brand-teal ring-brand-teal/20 font-geist inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs ring-1">
                    <span className="bg-brand-teal h-1.5 w-1.5 animate-pulse rounded-full"></span>
                    {t("landing.footer.newsletter.badge")}
                  </div>
                  <h4 className="font-geist text-2xl font-semibold tracking-tight text-white">
                    {t("landing.footer.newsletter.title")}
                  </h4>
                  <form onSubmit={handleSubmit} className="flex gap-3 pt-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="focus:ring-brand-teal/50 focus:border-brand-teal/50 h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/30 backdrop-blur transition-all outline-none focus:ring-2"
                    />
                    <button
                      type="submit"
                      className="bg-brand-teal text-brand-dark hover:bg-brand-light font-geist inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition"
                    >
                      {t("landing.footer.newsletter.join")}
                    </button>
                  </form>
                  <p className="font-geist text-xs text-white/40">
                    {t("landing.footer.newsletter.description")}
                  </p>
                </div>

                {/* Links Columns */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
                  <div>
                    <h5 className="font-geist mb-4 text-xs font-medium tracking-wider text-white/40 uppercase">
                      {t("landing.footer.sections.platform")}
                    </h5>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.browseProfiles")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.howItWorks")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.pricing")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.safety")}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-geist mb-4 text-xs font-medium tracking-wider text-white/40 uppercase">
                      {t("landing.footer.sections.professionals")}
                    </h5>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.joinNetwork")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.successStories")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.requirements")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.partnerLogin")}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-geist mb-4 text-xs font-medium tracking-wider text-white/40 uppercase">
                      {t("landing.footer.sections.company")}
                    </h5>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.aboutUs")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.contactSupport")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.termsOfService")}
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-brand-teal font-geist transition"
                          href="#"
                        >
                          {t("landing.footer.links.privacyPolicy")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <p className="font-geist text-sm text-white/40">
              {t("landing.footer.copyright")}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/40 transition hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/40 transition hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/40 transition hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
