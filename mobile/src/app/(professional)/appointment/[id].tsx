import { useLocalSearchParams } from "expo-router";
import { AppointmentDetailScreen } from "@/features/appointments";

export default function AppointmentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AppointmentDetailScreen id={id} />;
}
