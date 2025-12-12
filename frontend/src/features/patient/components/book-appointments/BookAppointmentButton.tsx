import { useTranslation } from "react-i18next";

interface BookAppointmentButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
}

export function BookAppointmentButton({
  onClick,
  disabled,
  isPending,
}: BookAppointmentButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-brand-dark w-full rounded-lg px-4 py-2 text-white disabled:bg-gray-300"
    >
      {isPending
        ? t("patient.booking.button.booking")
        : t("patient.booking.button.book")}
    </button>
  );
}
