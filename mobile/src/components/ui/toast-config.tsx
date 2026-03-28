import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ToastConfig } from "react-native-toast-message";

interface ToastProps {
  text1?: string;
  text2?: string;
}

function SuccessToast({ text1, text2 }: ToastProps) {
  return (
    <View style={[styles.container, styles.successBorder]}>
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark-circle" size={22} color="#14d3ac" />
      </View>
      <View style={styles.textWrapper}>
        {text1 ? (
          <Text style={styles.title} numberOfLines={2}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={styles.subtitle} numberOfLines={3}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ErrorToast({ text1, text2 }: ToastProps) {
  return (
    <View style={[styles.container, styles.errorBorder]}>
      <View style={styles.iconWrapper}>
        <Ionicons name="close-circle" size={22} color="#ef4444" />
      </View>
      <View style={styles.textWrapper}>
        {text1 ? (
          <Text style={styles.title} numberOfLines={2}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={styles.subtitle} numberOfLines={3}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function InfoToast({ text1, text2 }: ToastProps) {
  return (
    <View style={[styles.container, styles.infoBorder]}>
      <View style={styles.iconWrapper}>
        <Ionicons name="information-circle" size={22} color="#3fa6ff" />
      </View>
      <View style={styles.textWrapper}>
        {text1 ? (
          <Text style={styles.title} numberOfLines={2}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={styles.subtitle} numberOfLines={3}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <SuccessToast text1={props.text1} text2={props.text2} />,
  error: (props) => <ErrorToast text1={props.text1} text2={props.text2} />,
  info: (props) => <InfoToast text1={props.text1} text2={props.text2} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 280,
    maxWidth: 360,
  },
  successBorder: {
    borderLeftColor: "#14d3ac",
  },
  errorBorder: {
    borderLeftColor: "#ef4444",
  },
  infoBorder: {
    borderLeftColor: "#3fa6ff",
  },
  iconWrapper: {
    width: 28,
    alignItems: "center",
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00394a",
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    lineHeight: 18,
  },
});
