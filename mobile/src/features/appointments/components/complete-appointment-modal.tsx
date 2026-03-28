import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";
import { type AppointmentDto } from "@/features/appointments/types/api.types";
import { type CompleteAppointmentRequest } from "@/features/appointments/types/api.types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CompleteAppointmentModalProps {
  visible: boolean;
  appointment: AppointmentDto | null;
  onClose: () => void;
  onSubmit: (request: CompleteAppointmentRequest) => void;
  isLoading: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CompleteAppointmentModal({
  visible,
  appointment,
  onClose,
  onSubmit,
  isLoading,
}: CompleteAppointmentModalProps) {
  const { t } = useTranslation();

  const slideAnim = useRef(new Animated.Value(700)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [prescriptionPdf, setPrescriptionPdf] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [prescriptionTitle, setPrescriptionTitle] = useState("");
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [pdfError, setPdfError] = useState("");

  const resetForm = useCallback(() => {
    setPrescriptionPdf(null);
    setPrescriptionTitle("");
    setPrescriptionNotes("");
    setPdfError("");
  }, []);

  const animateClose = useCallback(
    (onDone: () => void) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 700,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(onDone);
    },
    [backdropOpacity, slideAnim],
  );

  const handleClose = useCallback(() => {
    if (isLoading) return;
    animateClose(() => {
      onClose();
      resetForm();
    });
  }, [isLoading, animateClose, onClose, resetForm]);

  const handlePickPdf = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPrescriptionPdf({
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType ?? "application/pdf",
      });
      setPdfError("");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!prescriptionPdf) {
      setPdfError(
        t("professional.dashboard.appointments.completeModal.pdfRequired"),
      );
      return;
    }
    if (!appointment) return;
    onSubmit({
      appointmentId: appointment.id,
      prescriptionPdf,
      prescriptionTitle: prescriptionTitle.trim() || undefined,
      prescriptionNotes: prescriptionNotes.trim() || undefined,
    });
  }, [
    prescriptionPdf,
    prescriptionTitle,
    prescriptionNotes,
    appointment,
    onSubmit,
    t,
  ]);

  if (!appointment) return null;

  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  const date = new Date(appointment.startDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const subtitle = `${patientName} · ${t("professional.dashboard.appointments.today")} ${hours}:${minutes}`;

  const canSubmit = !!prescriptionPdf && !isLoading;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
      onShow={() => {
        slideAnim.setValue(700);
        backdropOpacity.setValue(0);
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 28,
            stiffness: 220,
            useNativeDriver: true,
          }),
        ]).start();
      }}
    >
      {/* Backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              opacity: backdropOpacity,
            },
          ]}
        />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="Close"
          accessibilityRole="button"
        />
      </View>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end" }}
        pointerEvents="box-none"
      >
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          pointerEvents="auto"
        >
          <View
            style={{
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: Platform.OS === "ios" ? 40 : 32,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                alignItems: "center",
                paddingTop: 12,
                paddingBottom: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(0,57,74,0.15)",
                }}
              />
            </View>

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 4,
              }}
            >
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#00394a",
                    letterSpacing: -0.3,
                  }}
                >
                  {t("professional.dashboard.appointments.completeModal.title")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(0,84,110,0.6)",
                    marginTop: 3,
                  }}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                hitSlop={8}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={22} color="#374151" />
              </Pressable>
            </View>

            {/* Form */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={{ paddingHorizontal: 20 }}
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 4,
                gap: 16,
              }}
            >
              {/* PDF upload area */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#00394a",
                    marginBottom: 8,
                  }}
                >
                  {t(
                    "professional.dashboard.appointments.completeModal.pdf.label",
                  )}{" "}
                  <Text style={{ color: "rgba(0,84,110,0.45)" }}>*</Text>
                </Text>

                {prescriptionPdf ? (
                  // File selected — show filename + remove button
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(20,211,172,0.4)",
                      backgroundColor: "rgba(20,211,172,0.06)",
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color="#14d3ac"
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#00394a",
                          fontWeight: "500",
                          flexShrink: 1,
                        }}
                        numberOfLines={1}
                      >
                        {prescriptionPdf.name}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setPrescriptionPdf(null)}
                      hitSlop={8}
                      accessibilityLabel="Remove file"
                      accessibilityRole="button"
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color="rgba(0,84,110,0.4)"
                      />
                    </Pressable>
                  </View>
                ) : (
                  // Empty — show upload tap area
                  <Pressable
                    onPress={handlePickPdf}
                    style={{
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: pdfError ? "#ef4444" : "rgba(0,57,74,0.2)",
                      borderStyle: "dashed",
                      paddingVertical: 28,
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "rgba(0,57,74,0.02)",
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Upload prescription PDF"
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={28}
                      color={pdfError ? "#ef4444" : "rgba(0,84,110,0.35)"}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: pdfError ? "#ef4444" : "rgba(0,84,110,0.55)",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      {t(
                        "professional.dashboard.appointments.completeModal.pdf.placeholder",
                      )}
                    </Text>
                  </Pressable>
                )}

                {pdfError ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ef4444",
                      marginTop: 6,
                    }}
                  >
                    {pdfError}
                  </Text>
                ) : null}
              </View>

              {/* Prescription Title (optional) */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#00394a",
                    marginBottom: 8,
                  }}
                >
                  {t(
                    "professional.dashboard.appointments.completeModal.prescriptionTitle.label",
                  )}
                </Text>
                <TextInput
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.15)",
                    backgroundColor: "#fbfbfb",
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    fontSize: 15,
                    color: "#00394a",
                  }}
                  placeholder={t(
                    "professional.dashboard.appointments.completeModal.prescriptionTitle.placeholder",
                  )}
                  placeholderTextColor="rgba(0,84,110,0.35)"
                  value={prescriptionTitle}
                  onChangeText={setPrescriptionTitle}
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </View>

              {/* Notes (optional) */}
              <View style={{ marginBottom: 4 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#00394a",
                    marginBottom: 8,
                  }}
                >
                  {t(
                    "professional.dashboard.appointments.completeModal.notes.label",
                  )}
                </Text>
                <TextInput
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(0,57,74,0.15)",
                    backgroundColor: "#fbfbfb",
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    fontSize: 15,
                    color: "#00394a",
                    minHeight: 96,
                    textAlignVertical: "top",
                  }}
                  placeholder={t(
                    "professional.dashboard.appointments.completeModal.notes.placeholder",
                  )}
                  placeholderTextColor="rgba(0,84,110,0.35)"
                  value={prescriptionNotes}
                  onChangeText={setPrescriptionNotes}
                  multiline
                  numberOfLines={4}
                  editable={!isLoading}
                />
              </View>
            </ScrollView>

            {/* CTA buttons */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 12 }}>
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={{
                  backgroundColor: canSubmit ? "#00394a" : "rgba(0,57,74,0.25)",
                  borderRadius: 100,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
                accessibilityRole="button"
                accessibilityLabel="Mark as Completed"
              >
                {isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: -0.2,
                  }}
                >
                  {t(
                    "professional.dashboard.appointments.completeModal.submit",
                  )}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleClose}
                disabled={isLoading}
                style={{
                  alignItems: "center",
                  paddingVertical: 6,
                  opacity: isLoading ? 0.4 : 1,
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(0,84,110,0.6)",
                    fontWeight: "500",
                  }}
                >
                  {t(
                    "professional.dashboard.appointments.completeModal.cancel",
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
