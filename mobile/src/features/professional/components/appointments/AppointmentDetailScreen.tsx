import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useRespondToAppointment } from "@/features/professional/hooks/useRespondToAppointment";
import { useCancelAppointmentByProfessional } from "@/features/professional/hooks/useCancelAppointmentByProfessional";
import { useCompleteAppointment } from "@/features/professional/hooks/useCompleteAppointment";
import { CompleteAppointmentModal } from "@/features/professional/components/appointments/CompleteAppointmentModal";
import {
  AppointmentStatus,
  type AppointmentDto,
} from "@/features/professional/types/api.types";
import { cn } from "@/lib/utils";

// ─── Helpers ───────────────────────────────────────────────────────────────

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) {
    return `Today, ${time}`;
  }
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${day}, ${dayMonth} · ${time}`;
}

// ─── Badge style maps ───────────────────────────────────────────────────────

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

const urgencyStyles: Record<string, { container: string; text: string }> = {
  Low: { container: "bg-brand-teal/10", text: "text-brand-dark" },
  Medium: { container: "bg-brand-cream/60", text: "text-brand-dark" },
  High: { container: "bg-red-100", text: "text-red-600" },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const cardShadow = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 3,
};

interface DetailRowProps {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}

function DetailRow({ iconName, label, value }: DetailRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "rgba(0,57,74,0.06)",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <Ionicons name={iconName} size={15} color="#00546e" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: "rgba(0,84,110,0.5)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#00394a",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

interface AppointmentDetailScreenProps {
  appointment: AppointmentDto;
}

export function AppointmentDetailScreen({
  appointment,
}: AppointmentDetailScreenProps) {
  const { t } = useTranslation();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  type DialogKind = "accept" | "decline" | "cancel" | null;
  const [activeDialog, setActiveDialog] = useState<DialogKind>(null);

  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();
  const completeMutation = useCompleteAppointment();

  const { patient, status, startDate, endDate, price, urgency, notes } =
    appointment;

  const statusStyle = statusStyles[status] ?? statusStyles.Offered;
  const urgencyStyle = urgencyStyles[urgency] ?? urgencyStyles.Low;

  const patientName = `${patient.firstName} ${patient.lastName}`;
  const formattedStart = formatDateTime(startDate);
  const alertSubtitle = `${patientName} · ${formattedStart}`;

  const isOffered = status === AppointmentStatus.Offered;
  const isConfirmed = status === AppointmentStatus.Confirmed;
  const showActions = isOffered || isConfirmed;
  const isAnyLoading =
    respondMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending;

  const handleAccept = useCallback(() => setActiveDialog("accept"), []);
  const handleDecline = useCallback(() => setActiveDialog("decline"), []);
  const handleCancel = useCallback(() => setActiveDialog("cancel"), []);

  // Build conditional timestamp rows
  const timestampRows: {
    key: string;
    iconName: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value: string;
  }[] = [];
  if (appointment.offeredAt) {
    timestampRows.push({
      key: "offeredAt",
      iconName: "send-outline",
      label: t("professional.dashboard.appointments.detail.offeredAt"),
      value: formatDateTime(appointment.offeredAt),
    });
  }
  if (appointment.confirmedAt) {
    timestampRows.push({
      key: "confirmedAt",
      iconName: "checkmark-circle-outline",
      label: t("professional.dashboard.appointments.detail.confirmedAt"),
      value: formatDateTime(appointment.confirmedAt),
    });
  }
  if (appointment.completedAt) {
    timestampRows.push({
      key: "completedAt",
      iconName: "checkmark-done-outline",
      label: t("professional.dashboard.appointments.detail.completedAt"),
      value: formatDateTime(appointment.completedAt),
    });
  }
  if (appointment.cancelledAt) {
    timestampRows.push({
      key: "cancelledAt",
      iconName: "close-circle-outline",
      label: t("professional.dashboard.appointments.detail.cancelledAt"),
      value: formatDateTime(appointment.cancelledAt),
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Patient card ── */}
        <View className="mx-4 mt-4 bg-white rounded-2xl" style={cardShadow}>
          <Pressable
            className="p-5 flex-row items-center gap-4"
            onPress={() => router.push(`/(professional)/patient/${patient.id}`)}
            accessibilityRole="button"
            accessibilityLabel={t(
              "professional.dashboard.appointments.detail.viewPatient",
            )}
          >
            {patient.profilePictureUrl ? (
              <Image
                source={{ uri: patient.profilePictureUrl }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                contentFit="cover"
                accessibilityLabel={patientName}
              />
            ) : (
              <View
                className="w-14 h-14 rounded-full bg-brand-teal/20 items-center justify-center"
                accessibilityLabel={patientName}
              >
                <Text className="text-brand-dark font-bold text-lg">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#00394a",
                  letterSpacing: -0.3,
                }}
              >
                {patientName}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "rgba(0,84,110,0.6)",
                  marginTop: 2,
                }}
              >
                {calculateAge(patient.dateOfBirth)}{" "}
                {t("professional.dashboard.appointments.detail.yrs")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(0,84,110,0.35)"
            />
          </Pressable>

          {/* Status + urgency badges */}
          <View
            className="flex-row items-center gap-2 px-5 pb-5"
            style={{
              borderTopWidth: 1,
              borderTopColor: "rgba(0,84,110,0.06)",
              paddingTop: 16,
            }}
          >
            <View
              className={cn("px-2.5 py-1 rounded-full", statusStyle.container)}
            >
              <Text
                className={cn(
                  "text-[10px] font-bold uppercase",
                  statusStyle.text,
                )}
              >
                {t(`professional.dashboard.stats.${status.toLowerCase()}`)}
              </Text>
            </View>
            <View
              className={cn("px-2.5 py-1 rounded-full", urgencyStyle.container)}
            >
              <Text
                className={cn(
                  "text-[10px] font-bold uppercase",
                  urgencyStyle.text,
                )}
              >
                {urgency}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Appointment details card ── */}
        <View className="mx-4 mt-3 bg-white rounded-2xl p-5" style={cardShadow}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#00394a",
              letterSpacing: -0.2,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            {t("professional.dashboard.appointments.detail.detailsSection")}
          </Text>

          <View style={{ gap: 14 }}>
            <DetailRow
              iconName="time-outline"
              label={t("professional.dashboard.appointments.detail.startTime")}
              value={formatDateTime(startDate)}
            />
            <DetailRow
              iconName="time-outline"
              label={t("professional.dashboard.appointments.detail.endTime")}
              value={formatDateTime(endDate)}
            />
            <DetailRow
              iconName="cash-outline"
              label={t("professional.dashboard.appointments.detail.price")}
              value={`${price.toFixed(2)} TND`}
            />
            {timestampRows.map((row) => (
              <DetailRow
                key={row.key}
                iconName={row.iconName}
                label={row.label}
                value={row.value}
              />
            ))}
          </View>
        </View>

        {/* ── Notes card (only if present) ── */}
        {notes ? (
          <View
            className="mx-4 mt-3 bg-white rounded-2xl p-5"
            style={cardShadow}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#00394a",
                letterSpacing: -0.2,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              {t("professional.dashboard.appointments.detail.notes")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(0,84,110,0.7)",
                lineHeight: 22,
              }}
            >
              {notes}
            </Text>
          </View>
        ) : null}

        {/* ── Action buttons ── */}
        {showActions ? (
          <View style={{ marginHorizontal: 16, marginTop: 20, gap: 12 }}>
            {isOffered && (
              <>
                <Pressable
                  onPress={handleAccept}
                  disabled={isAnyLoading}
                  style={{
                    backgroundColor: isAnyLoading
                      ? "rgba(0,57,74,0.3)"
                      : "#00394a",
                    borderRadius: 100,
                    paddingVertical: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Accept appointment"
                >
                  {respondMutation.isPending && (
                    <ActivityIndicator size="small" color="#ffffff" />
                  )}
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {t("professional.dashboard.appointments.accept")}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleDecline}
                  disabled={isAnyLoading}
                  style={{
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.2)",
                    paddingVertical: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    opacity: isAnyLoading ? 0.5 : 1,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Decline appointment"
                >
                  <Text
                    style={{
                      color: "#00394a",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {t("professional.dashboard.appointments.decline")}
                  </Text>
                </Pressable>
              </>
            )}
            {isConfirmed && (
              <>
                <Pressable
                  onPress={() => setShowCompleteModal(true)}
                  disabled={isAnyLoading}
                  style={{
                    backgroundColor: isAnyLoading
                      ? "rgba(0,57,74,0.3)"
                      : "#00394a",
                    borderRadius: 100,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Complete appointment"
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {t("professional.dashboard.appointments.complete")}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleCancel}
                  disabled={isAnyLoading}
                  style={{
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.2)",
                    paddingVertical: 16,
                    alignItems: "center",
                    opacity: isAnyLoading ? 0.5 : 1,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel appointment"
                >
                  <Text
                    style={{
                      color: "#00394a",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {t("professional.dashboard.appointments.cancel")}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        ) : null}
      </ScrollView>

      <CompleteAppointmentModal
        visible={showCompleteModal}
        appointment={showCompleteModal ? appointment : null}
        onClose={() => setShowCompleteModal(false)}
        onSubmit={(req) => {
          completeMutation.mutate(req, {
            onSuccess: () => {
              setShowCompleteModal(false);
              router.back();
            },
          });
        }}
        isLoading={completeMutation.isPending}
      />

      {/* ── Confirmation dialogs ── */}
      <ConfirmDialog
        visible={activeDialog === "accept"}
        title={t("professional.dashboard.appointments.confirmAccept.title")}
        subtitle={alertSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmAccept.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmAccept.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          respondMutation.mutate(
            { appointmentId: appointment.id, isAccepted: true },
            { onSuccess: () => router.back() },
          );
        }}
        onDismiss={() => setActiveDialog(null)}
        isLoading={respondMutation.isPending}
      />
      <ConfirmDialog
        visible={activeDialog === "decline"}
        title={t("professional.dashboard.appointments.confirmDecline.title")}
        subtitle={alertSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmDecline.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmDecline.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          respondMutation.mutate(
            { appointmentId: appointment.id, isAccepted: false },
            { onSuccess: () => router.back() },
          );
        }}
        onDismiss={() => setActiveDialog(null)}
        isLoading={respondMutation.isPending}
        destructive
      />
      <ConfirmDialog
        visible={activeDialog === "cancel"}
        title={t("professional.dashboard.appointments.confirmCancel.title")}
        subtitle={alertSubtitle}
        confirmLabel={t(
          "professional.dashboard.appointments.confirmCancel.confirm",
        )}
        dismissLabel={t(
          "professional.dashboard.appointments.confirmCancel.dismiss",
        )}
        onConfirm={() => {
          setActiveDialog(null);
          cancelMutation.mutate(appointment.id, {
            onSuccess: () => router.back(),
          });
        }}
        onDismiss={() => setActiveDialog(null)}
        isLoading={cancelMutation.isPending}
        destructive
      />
    </View>
  );
}
