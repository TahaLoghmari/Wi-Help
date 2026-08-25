import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { ProfessionalProfileComposition } from "@/app-composition/profile-reviews";
import { useGetCurrentProfessional } from "@/entities/professional";

export default function MyProfileRoute() {
  const { data: professional, isPending } = useGetCurrentProfessional();

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
      onBack={() => router.back()}
    />
  );
}
