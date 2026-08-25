import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { ProfessionalProfileComposition } from "@/app-composition/profile-reviews";

export default function ProfessionalProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ProfessionalProfileComposition
      professionalId={id}
      onBack={() => router.back()}
    />
  );
}
