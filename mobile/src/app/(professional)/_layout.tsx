import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "@/components/guards/auth-guard";
import { SignalRProvider } from "@/providers/signalr-provider";

export default function ProfessionalLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const { t } = useTranslation();

  return (
    <AuthGuard role="Professional">
      <SignalRProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              backgroundColor: "#fbfbfb",
              borderTopColor: "rgba(0, 84, 110, 0.05)",
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: bottomInset,
            },
            tabBarActiveTintColor: "#00394a",
            tabBarInactiveTintColor: "rgba(0, 84, 110, 0.4)",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "600",
              letterSpacing: 0.3,
            },
          }}
        >
          <Tabs.Screen
            name="appointments"
            options={{
              title: t("professional.dashboard.tabs.appointments"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="calendar-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="patients"
            options={{
              title: t("professional.dashboard.tabs.patients"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="people-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule"
            options={{
              title: t("professional.dashboard.tabs.schedule"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="time-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="messages"
            options={{
              title: t("professional.dashboard.tabs.messages"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbubble-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              href: null,
              title: t("professional.notifications.title"),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: t("professional.dashboard.tabs.more"),
              tabBarIcon: ({ color }) => (
                <Ionicons name="menu-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="my-profile"
            options={{
              href: null,
              title: "My Profile",
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="patient/[id]"
            options={{
              href: null,
              title: "Patient Profile",
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="appointment/[id]"
            options={{
              href: null,
              title: "Appointment Detail",
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="conversation/[id]"
            options={{
              href: null,
              title: "Conversation",
              tabBarStyle: { display: "none" },
            }}
          />
        </Tabs>
      </SignalRProvider>
    </AuthGuard>
  );
}
