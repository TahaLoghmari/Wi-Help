import { router } from "expo-router";
import { OwnProfessionalProfileComposition } from "@/app-composition/own-professional-profile";

export default function MyProfileRoute() {
  return <OwnProfessionalProfileComposition onBack={() => router.back()} />;
}
