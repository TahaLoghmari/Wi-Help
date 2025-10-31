import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { REVIEWS } from "@/features/landing-page";

export function ReviewsSection() {
  return (
    <div className="my-20 flex flex-col items-center gap-28">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <p className="text-4xl font-bold">What Our Patiens Say</p>
        <p className="text-center text-lg text-gray-600">
          Real experiences from people who trust Wi Help
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {REVIEWS.map((review, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="mb-5 flex h-50 flex-col gap-4 rounded-md bg-white p-6 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-16 w-16 overflow-hidden rounded-full shadow-md ring-2 ring-gray-200">
                    <img
                      src={review.profilePictureUrl}
                      alt={`${review.name} profile`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>{review.name}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.numberOfStars }).map(
                        (_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            fill="currentColor"
                            className="h-3 w-3 text-[#f2c13d]"
                          >
                            <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                          </svg>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.reviewText}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
