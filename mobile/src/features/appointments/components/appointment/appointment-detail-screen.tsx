import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import {
  useCancelAppointmentByProfessional,
  useCompleteAppointment,
  useGetAppointmentById,
  useRespondToAppointment,
} from "@/entities/appointment";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { CompleteAppointmentModal } from "@/features/appointments/components/complete-appointment-modal";
import { cn } from "@/lib/utils";
import {
  calculateAge,
  formatDateTime,
  formatTime,
  formatDateOnly,
  statusStyles,
  urgencyStyles,
  cardShadow,
} from "@/features/appointments/lib/utils";
import {
  getAppointmentActionPolicy,
  projectAppointmentTimeline,
} from "@/features/appointments/lib/appointment-presentation";
import {
  timelineDotColors,
  type TimelineRow,
} from "@/features/appointments/lib/constants";
import { SectionLabel } from "./section-label";
import { TopBar } from "./top-bar";

// ─── Footer height (paddingTop + btn + gap + btn + paddingBottom) ─────────────
// 8 + 56 + 10 + 56 + 16 = 146 — add a few px safety margin
const ACTION_FOOTER_HEIGHT = 150;

// ─── Main component ─────────────────────────────────────────────────────────

interface AppointmentDetailScreenProps {
  id: string;
  onBack: () => void;
  onOpenPatient: (patientId: string) => void;
}

export function AppointmentDetailScreen({
  id,
  onBack,
  onOpenPatient,
}: AppointmentDetailScreenProps) {
  const { t } = useTranslation();
  const { data: appointment, isPending, isError } = useGetAppointmentById(id);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  type DialogKind = "accept" | "decline" | "cancel" | null;
  const [activeDialog, setActiveDialog] = useState<DialogKind>(null);

  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();
  const completeMutation = useCompleteAppointment();
  const handleApiError = useHandleApiError();

  const handleAccept = useCallback(() => setActiveDialog("accept"), []);
  const handleDecline = useCallback(() => setActiveDialog("decline"), []);
  const handleCancel = useCallback(() => setActiveDialog("cancel"), []);

  const screenTitle = t(
    "professional.dashboard.appointments.detail.screenTitle",
  );

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-brand-bg" edges={["top", "bottom"]}>
        <TopBar title={screenTitle} onBack={onBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00546e" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !appointment) {
    return (
      <SafeAreaView className="flex-1 bg-brand-bg" edges={["top", "bottom"]}>
        <TopBar title={screenTitle} onBack={onBack} />
        <View className="flex-1 items-center justify-center px-6 gap-3">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color="rgba(0,84,110,0.2)"
          />
          <Text className="text-base font-semibold text-brand-dark">
            {t("professional.dashboard.appointments.detail.notFound")}
          </Text>
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text className="text-sm text-brand-teal font-medium">
              {t("professional.dashboard.appointments.detail.goBack")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { patient, status, startDate, endDate, price, urgency, notes } =
    appointment;

  const statusStyle = statusStyles[status] ?? statusStyles.Offered;
  const urgencyStyle = urgencyStyles[urgency] ?? urgencyStyles.Low;

  const patientName = `${patient.firstName} ${patient.lastName}`;
  const formattedStart = formatDateTime(startDate);
  const alertSubtitle = `${patientName} · ${formattedStart}`;

  const { canAccept, canDecline, canComplete, canCancel, showActions } =
    getAppointmentActionPolicy(status);
  const isAnyLoading =
    respondMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending;

  // Banner timestamp — earliest lifecycle event
  const bannerTimestamp = appointment.offeredAt
    ? `${t("professional.dashboard.stats.offered")} · ${formatDateTime(appointment.offeredAt)}`
    : null;

  const timelineRows: TimelineRow[] = projectAppointmentTimeline(
    appointment,
  ).map(({ key, occurredAt }) => ({
    key,
    label: t(`professional.dashboard.appointments.detail.${key}`),
    value: formatDateTime(occurredAt),
    dotColor: timelineDotColors[key],
  }));

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top", "bottom"]}>
      <TopBar title={screenTitle} onBack={onBack} />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: showActions ? ACTION_FOOTER_HEIGHT : 32,
          }}
        >
          {/* ── Status + Urgency banner ── */}
          <View
            className="mx-4 mb-3 bg-white rounded-2xl p-4"
            style={cardShadow}
          >
            <View className="flex-row items-center gap-2">
              <View
                className={cn(
                  "px-2.5 py-1 rounded-full",
                  statusStyle.container,
                )}
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
                className={cn(
                  "px-2.5 py-1 rounded-full",
                  urgencyStyle.container,
                )}
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
            {bannerTimestamp ? (
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(0,84,110,0.5)",
                  marginTop: 10,
                }}
              >
                {bannerTimestamp}
              </Text>
            ) : null}
          </View>

          {/* ── Time & Price card ── */}
          <View
            className="mx-4 mb-3 bg-white rounded-2xl overflow-hidden"
            style={cardShadow}
          >
            {/* Time row */}
            <View
              className="flex-row items-center gap-3 px-5"
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,84,110,0.06)",
              }}
            >
              <Ionicons name="time-outline" size={18} color="#00546e" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#00394a",
                  letterSpacing: -0.2,
                }}
              >
                {formatTime(startDate)} → {formatTime(endDate)}
              </Text>
            </View>

            {/* Date row */}
            <View
              className="flex-row items-center gap-3 px-5"
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,84,110,0.06)",
              }}
            >
              <Ionicons name="calendar-outline" size={18} color="#00546e" />
              <Text
                style={{ fontSize: 14, fontWeight: "500", color: "#00394a" }}
              >
                {formatDateOnly(startDate)}
              </Text>
            </View>

            {/* Price row */}
            <View
              className="flex-row items-center gap-3 px-5"
              style={{ paddingVertical: 14 }}
            >
              <Ionicons name="cash-outline" size={18} color="#14d3ac" />
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#14d3ac" }}
              >
                {price.toFixed(2)} TND
              </Text>
            </View>
          </View>

          {/* ── Patient section ── */}
          <View className="mx-4 mb-3">
            <SectionLabel
              label={t("professional.dashboard.appointments.detail.patient")}
            />
            <View className="bg-white rounded-2xl" style={cardShadow}>
              <Pressable
                className="p-4 flex-row items-center gap-4 active:opacity-80"
                onPress={() => onOpenPatient(patient.id)}
                accessibilityRole="button"
                accessibilityLabel={t(
                  "professional.dashboard.appointments.detail.viewPatient",
                )}
              >
                {patient.profilePictureUrl ? (
                  <Image
                    source={{ uri: patient.profilePictureUrl }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                    accessibilityLabel={patientName}
                  />
                ) : (
                  <View
                    className="w-12 h-12 rounded-full bg-brand-teal/20 items-center justify-center"
                    accessibilityLabel={patientName}
                  >
                    <Text className="text-brand-dark font-semibold text-base">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#00394a",
                      letterSpacing: -0.2,
                    }}
                  >
                    {patientName}
                  </Text>
                  <View style={{ marginTop: 4, flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "rgba(0,84,110,0.08)",
                        borderRadius: 100,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#00546e",
                        }}
                      >
                        {calculateAge(patient.dateOfBirth)}{" "}
                        {t("professional.dashboard.appointments.detail.yrs")}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="rgba(0,84,110,0.35)"
                />
              </Pressable>
            </View>
          </View>

          {/* ── Notes section ── */}
          <View className="mx-4 mb-3">
            <SectionLabel
              label={t("professional.dashboard.appointments.detail.notes")}
            />
            <View className="bg-white rounded-2xl p-4" style={cardShadow}>
              {notes ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(0,84,110,0.7)",
                    lineHeight: 22,
                  }}
                >
                  {notes}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(0,84,110,0.35)",
                    fontStyle: "italic",
                  }}
                >
                  {t("professional.dashboard.appointments.detail.noNotes")}
                </Text>
              )}
            </View>
          </View>

          {/* ── Timeline section ── */}
          {timelineRows.length > 0 && (
            <View className="mx-4 mb-3">
              <SectionLabel
                label={t("professional.dashboard.appointments.detail.timeline")}
              />
              <View
                className="bg-white rounded-2xl overflow-hidden"
                style={cardShadow}
              >
                {timelineRows.map((row, index) => (
                  <View
                    key={row.key}
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                      },
                      index < timelineRows.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0,84,110,0.06)",
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: row.dotColor,
                        marginRight: 12,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#00394a",
                      }}
                    >
                      {row.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(0,84,110,0.6)" }}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Closed label for terminal states */}
          {!showActions && (
            <View className="mx-4 mt-2 items-center">
              <Text
                style={{
                  fontSize: 13,
                  color: "rgba(0,84,110,0.35)",
                  fontStyle: "italic",
                }}
              >
                {t("professional.dashboard.appointments.detail.closedLabel")}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ── Action buttons ─────────────────────────────────────────────────
            Sits inside the SafeAreaView so it is already above the home
            indicator. paddingBottom: 16 is purely aesthetic spacing.        ── */}
        {showActions && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 16,
              gap: 10,
            }}
          >
            {canAccept && canDecline && (
              <>
                <Pressable
                  onPress={handleAccept}
                  disabled={isAnyLoading}
                  className="active:opacity-80"
                  style={{
                    backgroundColor: isAnyLoading
                      ? "rgba(0,57,74,0.3)"
                      : "#00394a",
                    borderRadius: 100,
                    height: 56,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
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
                  className="active:opacity-80"
                  style={{
                    borderRadius: 100,
                    height: 56,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
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
            {canComplete && canCancel && (
              <>
                <Pressable
                  onPress={() => setShowCompleteModal(true)}
                  disabled={isAnyLoading}
                  className="active:opacity-80"
                  style={{
                    backgroundColor: isAnyLoading
                      ? "rgba(0,57,74,0.3)"
                      : "#00394a",
                    borderRadius: 100,
                    height: 56,
                    alignItems: "center",
                    justifyContent: "center",
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
                  className="active:opacity-80"
                  style={{
                    borderRadius: 100,
                    height: 56,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
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
        )}

        <CompleteAppointmentModal
          visible={showCompleteModal}
          appointment={showCompleteModal ? appointment : null}
          onClose={() => setShowCompleteModal(false)}
          onSubmit={(values) => {
            completeMutation.mutate(
              { appointmentId: appointment.id, ...values },
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Appointment completed",
                  });
                  setShowCompleteModal(false);
                  onBack();
                },
                onError: handleApiError,
              },
            );
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
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Appointment accepted",
                  });
                  onBack();
                },
                onError: handleApiError,
              },
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
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Appointment declined",
                  });
                  onBack();
                },
                onError: handleApiError,
              },
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
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Appointment cancelled",
                });
                onBack();
              },
              onError: handleApiError,
            });
          }}
          onDismiss={() => setActiveDialog(null)}
          isLoading={cancelMutation.isPending}
          destructive
        />
      </View>
    </SafeAreaView>
  );
}
