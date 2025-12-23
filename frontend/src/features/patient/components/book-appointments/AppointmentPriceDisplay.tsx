import type { GetProfessionalDto } from "@/features/professional/hooks/GetProfessional/GetProfessionalDto";
import { useTranslation } from "react-i18next";

interface AppointmentPriceDisplayProps {
  price: number;
  professional: GetProfessionalDto;
}

export function AppointmentPriceDisplay({
  price,
  professional,
}: AppointmentPriceDisplayProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {t("patient.booking.price.session")}
        </span>
        <span className="text-brand-dark text-lg font-semibold">
          {price} TND
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {t("patient.booking.price.visitPrice")}: {professional.visitPrice} TND
      </p>
    </div>
  );
}
