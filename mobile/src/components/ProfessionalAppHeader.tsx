import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useHasUnreadNotifications } from "@/features/notifications/hooks/useHasUnreadNotifications";
import { ROUTE_PATHS } from "@/config/routes";

interface ProfessionalAppHeaderProps {
  scrollY?: SharedValue<number>;
}

export function ProfessionalAppHeader({ scrollY }: ProfessionalAppHeaderProps) {
  const { data: user } = useCurrentUser();
  const { hasUnread } = useHasUnreadNotifications();
  const pathname = usePathname();
  const isOnNotifications = pathname === "/notifications";

  const borderStyle = useAnimatedStyle(() => ({
    opacity: scrollY
      ? interpolate(scrollY.value, [0, 8], [0, 1], Extrapolation.CLAMP)
      : 1,
  }));

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-brand-bg">
      {/* Logo */}
      <View className="flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/icon-2.png")}
          style={{ width: 32, height: 32, borderRadius: 8 }}
          contentFit="contain"
        />
        <Text className="text-xl font-semibold text-brand-dark tracking-tight">
          Wi-Help
        </Text>
      </View>

      {/* Right actions */}
      <View className="flex-row items-center gap-4">
        {/* Notification bell */}
        <Pressable
          className="relative"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={() => {
            if (!isOnNotifications) {
              router.push(ROUTE_PATHS.PROFESSIONAL.NOTIFICATIONS);
            }
          }}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Ionicons
            name={isOnNotifications ? "notifications" : "notifications-outline"}
            size={24}
            color={isOnNotifications ? "#00394a" : "#00546e"}
          />
          {hasUnread && !isOnNotifications && (
            <View className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-teal border border-brand-bg" />
          )}
        </Pressable>

        {/* Avatar */}
        <Pressable
          className="w-9 h-9 rounded-full border-2 border-brand-teal/20 overflow-hidden bg-brand-secondary/10 items-center justify-center"
          hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          {user?.profilePictureUrl ? (
            <Image
              source={{ uri: user.profilePictureUrl }}
              style={{ width: 36, height: 36 }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={18} color="#00546e" />
          )}
        </Pressable>
      </View>

      {/* Scroll-reveal separator */}
      <Animated.View
        style={[
          borderStyle,
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "rgba(0,84,110,0.08)",
          },
        ]}
      />
    </View>
  );
}
