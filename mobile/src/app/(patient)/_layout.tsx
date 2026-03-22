import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fbfbfb",
          borderTopColor: "rgba(0, 84, 110, 0.05)",
          borderTopWidth: 1,
          paddingTop: 8,
          height: 72,
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
    </Tabs>
  );
}
