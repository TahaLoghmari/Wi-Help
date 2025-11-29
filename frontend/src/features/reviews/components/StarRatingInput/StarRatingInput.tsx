import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
}

export function StarRatingInput({ value, onChange, className }: StarRatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  const displayRating = hoveredRating ?? value;

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(null)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={cn(
              "h-4 w-4 transition-colors",
              rating <= displayRating
                ? "text-[#f5a623] fill-current"
                : "text-slate-300",
            )}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

