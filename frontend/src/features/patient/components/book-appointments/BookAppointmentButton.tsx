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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg bg-[#00394a] px-4 py-2 text-white disabled:bg-gray-300"
    >
      {isPending ? "Booking..." : "Book Appointment"}
    </button>
  );
}
