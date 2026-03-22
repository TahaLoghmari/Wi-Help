import React from "react";
import { View, Text, Pressable, type ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import {
  type AppointmentDto,
  AppointmentStatus,
} from "@/features/professional/types/api.types";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(dateString: string, todayLabel: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) return `${todayLabel}, ${time}`;

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${dayName}, ${dayMonth} · ${time}`;
}

// ─── Status badge ───────────────────────────────────────────────────────────

const statusStyles: Record<
  AppointmentStatus,
  { container: string; text: string }
> = {
  Offered: { container: "bg-brand-blue/10", text: "text-brand-blue" },
  Confirmed: { container: "bg-brand-teal/10", text: "text-brand-teal" },
  Completed: { container: "bg-brand-light/10", text: "text-emerald-600" },
  Cancelled: {
    container: "bg-brand-secondary/10",
    text: "text-brand-secondary",
  },
};

// ─── Urgency badge ──────────────────────────────────────────────────────────

const urgencyStyles: Record<string, { container: string; text: string }> = {
  Low: { container: "bg-brand-teal/10", text: "text-brand-dark" },
  Medium: { container: "bg-brand-cream/60", text: "text-brand-dark" },
  High: { container: "bg-red-100", text: "text-red-600" },
};

// ─── Component ──────────────────────────────────────────────────────────────

interface AppointmentCardProps {
  appointment: AppointmentDto;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  style?: ViewStyle;
}

export const AppointmentCard = React.memo(function AppointmentCard({
  appointment,
  onAccept,
  onDecline,
  onCancel,
  onViewDetails,
  style,
}: AppointmentCardProps) {
  const { t } = useTranslation();
  const { patient, status, startDate, price, urgency, notes } = appointment;
  const statusStyle = statusStyles[status] ?? statusStyles.Offered;
  const urgencyStyle = urgencyStyles[urgency] ?? urgencyStyles.Low;

  const isOffered = status === AppointmentStatus.Offered;
  const isConfirmed = status === AppointmentStatus.Confirmed;
  const showActions = isOffered || isConfirmed;

  return (
    <View
      className="bg-white p-5 rounded-2xl mb-3.5"
      style={[
        {
          shadowColor: "#00222e",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.04,
          shadowRadius: 16,
          elevation: 3,
        },
        style,
      ]}
      accessibilityRole="none"
    >
      {/* Row 1: Patient info + status badge */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {patient.profilePictureUrl ? (
            <Image
              source={{ uri: patient.profilePictureUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
              accessibilityLabel={`${patient.firstName} ${patient.lastName}`}
            />
          ) : (
            <View
              className="w-10 h-10 rounded-full bg-brand-teal/20 items-center justify-center"
              accessibilityLabel={`${patient.firstName} ${patient.lastName}`}
            >
              <Text className="text-brand-dark font-bold text-sm">
                {patient.firstName[0]}
                {patient.lastName[0]}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text
              className="font-bold text-brand-dark text-sm"
              numberOfLines={1}
            >
              {patient.firstName} {patient.lastName}
            </Text>
            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Patient ID: #{patient.id.slice(0, 8).toUpperCase()}
            </Text>
          </View>
        </View>
        <View className={cn("px-2.5 py-1 rounded-full", statusStyle.container)}>
          <Text
            className={cn("text-[10px] font-bold uppercase", statusStyle.text)}
          >
            {t(`professional.dashboard.stats.${status.toLowerCase()}`)}
          </Text>
        </View>
      </View>

      {/* Row 2: Date + Price + Urgency badge */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={15} color="#00546e" />
          <Text className="text-xs text-slate-600 font-medium">
            {formatDate(
              startDate,
              t("professional.dashboard.appointments.today"),
            )}
          </Text>
        </View>
        <Text className="text-xs font-bold text-brand-teal">
          {price.toFixed(2)} TND
        </Text>
        <View
          className={cn("px-2.5 py-1 rounded-full", urgencyStyle.container)}
        >
          <Text
            className={cn("text-[10px] font-bold uppercase", urgencyStyle.text)}
          >
            {urgency}
          </Text>
        </View>
      </View>

      {/* Row 3: Notes */}
      {notes ? (
        <Text
          className="text-xs text-slate-400 leading-relaxed mb-4"
          numberOfLines={2}
        >
          {notes}
        </Text>
      ) : null}

      {/* Row 4: Action buttons */}
      {showActions ? (
        <View className="flex-row items-center gap-2 pt-1">
          {isOffered && (
            <>
              <Pressable
                className="flex-1 bg-brand-dark py-3 rounded-full items-center active:opacity-80"
                onPress={() => onAccept?.(appointment.id)}
                accessibilityLabel="Accept appointment"
                accessibilityRole="button"
              >
                <Text className="text-white text-xs font-bold">
                  {t("professional.dashboard.appointments.accept")}
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 border border-brand-dark/20 py-3 rounded-full items-center active:opacity-80"
                onPress={() => onDecline?.(appointment.id)}
                accessibilityLabel="Decline appointment"
                accessibilityRole="button"
              >
                <Text className="text-brand-dark text-xs font-bold">
                  {t("professional.dashboard.appointments.decline")}
                </Text>
              </Pressable>
            </>
          )}
          {isConfirmed && (
            <Pressable
              className="flex-1 border border-brand-dark/20 py-3 rounded-full items-center active:opacity-80"
              onPress={() => onCancel?.(appointment.id)}
              accessibilityLabel="Cancel appointment"
              accessibilityRole="button"
            >
              <Text className="text-brand-dark text-xs font-bold">
                {t("professional.dashboard.appointments.cancel")}
              </Text>
            </Pressable>
          )}
          <Pressable
            className="w-10 h-10 items-center justify-center rounded-full border border-brand-secondary/15 active:opacity-80"
            onPress={() => onViewDetails?.(appointment.id)}
            accessibilityLabel="View appointment details"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-forward" size={16} color="#00394a" />
          </Pressable>
        </View>
      ) : (
        <View className="flex-row justify-end pt-1">
          <Pressable
            className="w-10 h-10 items-center justify-center rounded-full border border-brand-secondary/15 active:opacity-80"
            onPress={() => onViewDetails?.(appointment.id)}
            accessibilityLabel="View appointment details"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-forward" size={16} color="#00394a" />
          </Pressable>
        </View>
      )}
    </View>
  );
});
