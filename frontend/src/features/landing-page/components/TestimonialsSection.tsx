import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: t("landing.testimonials.items.0.name"),
      role: t("landing.testimonials.items.0.role"),
      avatar: "https://i.pravatar.cc/150?img=35",
      quote: t("landing.testimonials.items.0.quote"),
    },
    {
      id: 2,
      name: t("landing.testimonials.items.1.name"),
      role: t("landing.testimonials.items.1.role"),
      avatar: "https://i.pravatar.cc/150?img=11",
      quote: t("landing.testimonials.items.1.quote"),
    },
    {
      id: 3,
      name: t("landing.testimonials.items.2.name"),
      role: t("landing.testimonials.items.2.role"),
      avatar: "https://i.pravatar.cc/150?img=5",
      quote: t("landing.testimonials.items.2.quote"),
    },
  ];

  return (
    <section className="bg-brand-dark relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <span className="text-brand-teal font-geist inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium backdrop-blur">
            {t("landing.testimonials.badge")}
          </span>
          <h2 className="font-geist mt-4 text-3xl font-semibold tracking-tighter text-white md:text-5xl">
            {t("landing.testimonials.title")}
          </h2>
          <p className="font-geist mt-4 text-base font-light text-white/70">
            {t("landing.testimonials.description")}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="ring-brand-teal/50 h-10 w-10 rounded-full object-cover ring-2"
                  />
                  <div>
                    <p className="font-geist text-sm font-semibold tracking-tight text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-brand-teal font-geist text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-brand-cream fill-brand-cream h-4 w-4"
                    />
                  ))}
                </div>
                <p className="font-geist mt-4 text-sm leading-relaxed text-white/80">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
