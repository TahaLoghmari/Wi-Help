import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { ProfessionalProfileScreen } from "@/features/professionals/components/profile/professional-profile-screen";

export default function ProfessionalProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ProfessionalProfileScreen
      professionalId={id}
      onBack={() => router.back()}
    />
  );
}
