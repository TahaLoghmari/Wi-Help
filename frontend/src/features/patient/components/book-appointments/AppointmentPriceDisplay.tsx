import type { GetProfessionalDto } from "@/features/professional/hooks/GetProfessional/GetProfessionalDto";

interface AppointmentPriceDisplayProps {
  price: number;
  professional: GetProfessionalDto;
}

export function AppointmentPriceDisplay({
  price,
  professional,
}: AppointmentPriceDisplayProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Session Price:
        </span>
        <span className="text-brand-dark text-lg font-semibold">
          {price} TND
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Professional's price range: {professional.startPrice} -{" "}
        {professional.endPrice} TND
      </p>
    </div>
  );
}
