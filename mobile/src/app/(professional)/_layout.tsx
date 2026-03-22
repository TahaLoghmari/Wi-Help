import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfessionalGuard } from "@/components/Guards/ProfessionalGuard";

export default function ProfessionalLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <ProfessionalGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
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
            title: "Appointments",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: "Patients",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Schedule",
            tabBarIcon: ({ color }) => (
              <Ionicons name="time-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
          }}
        />
        {/* Patient detail — hidden from tab bar, accessible via router.push */}
        <Tabs.Screen
          name="patient/[id]"
          options={{ href: null, title: "Patient Profile" }}
        />
      </Tabs>
    </ProfessionalGuard>
  );
}
