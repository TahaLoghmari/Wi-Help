import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Leila K.",
    role: "Patient Daughter",
    avatar: "https://i.pravatar.cc/150?img=35",
    quote:
      "Finding a reliable nurse for my father's daily insulin was a nightmare until Wi-Help. The profile transparency gave us total peace of mind.",
  },
  {
    id: 2,
    name: "Youssef B.",
    role: "Physiotherapist",
    avatar: "https://i.pravatar.cc/150?img=11",
    quote:
      "Wi-Help allows me to fill my schedule gaps efficiently. The payment is secure, and I don't have to worry about chasing invoices anymore.",
  },
  {
    id: 3,
    name: "Nadia T.",
    role: "Post-Op Patient",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote:
      "The booking process is incredibly smooth. I could see the nurse's certifications right on the app, which meant everything to me.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-brand-dark relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <span className="text-brand-teal font-geist inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium backdrop-blur">
            Success Stories
          </span>
          <h2 className="font-geist mt-4 text-3xl font-semibold tracking-tighter text-white md:text-5xl">
            Tunisians trust Wi-Help.
          </h2>
          <p className="font-geist mt-4 text-base font-light text-white/70">
            Real experiences from patients and professionals transforming home
            care.
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
