import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useGetCurrentProfessional } from "@/entities/professional";
import { ProfessionalProfileScreen } from "@/features/professionals";

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
    <ProfessionalProfileScreen
      professionalId={professional.id}
      onBack={() => router.back()}
    />
  );
}
