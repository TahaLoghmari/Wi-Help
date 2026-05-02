import React, { useState } from "react";
import { View, Text, Pressable, type ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import {
  type AppointmentDto,
  AppointmentStatus,
} from "@/features/appointments/types/api.types";
import {
  formatDate,
  calculateAge,
  statusStyles,
  urgencyStyles,
} from "@/features/appointments/lib/utils";

interface AppointmentCardProps {
  appointment: AppointmentDto;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  style?: ViewStyle;
}

export const AppointmentCard = React.memo(function AppointmentCard({
  appointment,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
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

  const todayLabel = t("professional.dashboard.appointments.today");
  const formattedDate = formatDate(startDate, todayLabel);
  const patientName = `${patient.firstName} ${patient.lastName}`;
  const dialogSubtitle = `${patientName} · ${formattedDate}`;

  type DialogKind = "accept" | "decline" | "cancel" | null;
  const [activeDialog, setActiveDialog] = useState<DialogKind>(null);

  const handleAcceptPress = () => setActiveDialog("accept");
  const handleDeclinePress = () => setActiveDialog("decline");
  const handleCancelPress = () => setActiveDialog("cancel");

  const cardShadow = {
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  };

  // ─── Inner rows (shared between both layouts) ───
  const innerRows = (
    <>
      {/* Row 1: Patient info + status badge */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {patient.profilePictureUrl ? (
            <Image
              source={{ uri: patient.profilePictureUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
              accessibilityLabel={patientName}
            />
          ) : (
            <View
              className="w-10 h-10 rounded-full bg-brand-teal/20 items-center justify-center"
              accessibilityLabel={patientName}
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
              {patientName}
            </Text>
            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {calculateAge(patient.dateOfBirth)}{" "}
              {t("professional.dashboard.appointments.detail.yrs")}
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
      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: notes ? 16 : 0 }}
      >
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={15} color="#00546e" />
          <Text className="text-xs text-slate-600 font-medium">
            {formattedDate}
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
          className="text-xs text-slate-400 leading-relaxed"
          numberOfLines={2}
        >
          {notes}
        </Text>
      ) : null}
    </>
  );

  if (!showActions) {
    // Terminal state: entire card is one tappable area
    return (
      <Pressable
        className="bg-white rounded-2xl mb-3.5"
        style={[cardShadow, style]}
        onPress={() => onViewDetails?.(appointment.id)}
        accessibilityRole="button"
        accessibilityLabel="View appointment details"
      >
        <View className="p-5">{innerRows}</View>
        <View className="flex-row justify-end px-5 pb-5">
          <View className="w-10 h-10 items-center justify-center rounded-full border border-brand-secondary/15">
            <Ionicons name="chevron-forward" size={16} color="#00394a" />
          </View>
        </View>
      </Pressable>
    );
  }

  // Active state: body tappable, action row separate
  return (
    <View
      className="bg-white rounded-2xl mb-3.5"
      style={[cardShadow, style]}
      accessibilityRole="none"
    >
      {/* Tappable body */}
      <Pressable
        className="px-5 pt-5"
        style={{ paddingBottom: 0 }}
        onPress={() => onViewDetails?.(appointment.id)}
        accessibilityRole="button"
        accessibilityLabel="View appointment details"
      >
        {innerRows}
      </Pressable>

      {/* Action row */}
      <View className="flex-row items-center gap-2 px-5 pt-3 pb-5">
        {isOffered && (
          <>
            <Pressable
              className="flex-1 bg-brand-dark py-3 rounded-full items-center active:opacity-80"
              onPress={handleAcceptPress}
              accessibilityLabel="Accept appointment"
              accessibilityRole="button"
            >
              <Text className="text-white text-xs font-bold">
                {t("professional.dashboard.appointments.accept")}
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 border border-brand-dark/20 py-3 rounded-full items-center active:opacity-80"
              onPress={handleDeclinePress}
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
          <>
            <Pressable
              className="flex-1 bg-brand-dark py-3 rounded-full items-center active:opacity-80"
              onPress={() => onComplete?.(appointment.id)}
              accessibilityLabel="Complete appointment"
              accessibilityRole="button"
            >
              <Text className="text-white text-xs font-bold">
                {t("professional.dashboard.appointments.complete")}
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 border border-brand-dark/20 py-3 rounded-full items-center active:opacity-80"
              onPress={handleCancelPress}
              accessibilityLabel="Cancel appointment"
              accessibilityRole="button"
            >
              <Text className="text-brand-dark text-xs font-bold">
                {t("professional.dashboard.appointments.cancel")}
              </Text>
            </Pressable>
          </>
        )}
        <Pressable
          className="w-10 h-10 items-center justify-center rounded-full border border-brand-secondary/15 active:opacity-80"
          hitSlop={{ top: 2, right: 2, bottom: 2, left: 2 }}
          onPress={() => onViewDetails?.(appointment.id)}
          accessibilityLabel="View appointment details"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-forward" size={16} color="#00394a" />
        </Pressable>
      </View>

      {/* ── Confirmation dialogs ── */}
      <ConfirmDialog
        visible={activeDialog === "accept"}
        title={t("professional.dashboard.appointments.confirmAccept.title")}
        subtitle={dialogSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmAccept.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmAccept.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          onAccept?.(appointment.id);
        }}
        onDismiss={() => setActiveDialog(null)}
      />
      <ConfirmDialog
        visible={activeDialog === "decline"}
        title={t("professional.dashboard.appointments.confirmDecline.title")}
        subtitle={dialogSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmDecline.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmDecline.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          onDecline?.(appointment.id);
        }}
        onDismiss={() => setActiveDialog(null)}
        destructive
      />
      <ConfirmDialog
        visible={activeDialog === "cancel"}
        title={t("professional.dashboard.appointments.confirmCancel.title")}
        subtitle={dialogSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmCancel.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmCancel.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          onCancel?.(appointment.id);
        }}
        onDismiss={() => setActiveDialog(null)}
        destructive
      />
    </View>
  );
});
