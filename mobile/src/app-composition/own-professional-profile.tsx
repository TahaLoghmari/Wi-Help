import { ActivityIndicator, View } from "react-native";
import { useGetCurrentProfessional } from "@/features/professionals/api";
import { ProfessionalProfileComposition } from "./profile-reviews";

export function OwnProfessionalProfileComposition({
  onBack,
}: {
  onBack: () => void;
}) {
  const { data: professional, isPending } = useGetCurrentProfessional();

  // Preserve missing-identity/loading behavior; an error-state redesign is
  // a product change, not part of this structural migration.
  if (isPending || !professional) {
    return (
      <View className="flex-1 bg-brand-bg items-center justify-center">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  return (
    <ProfessionalProfileComposition
      professionalId={professional.id}
      onBack={onBack}
    />
  );
}
