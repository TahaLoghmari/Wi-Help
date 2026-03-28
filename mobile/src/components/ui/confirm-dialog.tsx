import React, { useRef, useEffect, useCallback } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  dismissLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
  destructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  subtitle,
  confirmLabel,
  dismissLabel,
  onConfirm,
  onDismiss,
  destructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    scaleAnim.setValue(0.92);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 18,
        stiffness: 280,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const animateOut = useCallback(
    (onDone: () => void) => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.92,
          useNativeDriver: true,
          damping: 18,
          stiffness: 280,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(onDone);
    },
    [scaleAnim, opacityAnim],
  );

  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible, animateIn]);

  const handleDismiss = useCallback(() => {
    if (isLoading) return;
    animateOut(onDismiss);
  }, [isLoading, animateOut, onDismiss]);

  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    onConfirm();
  }, [isLoading, onConfirm]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleDismiss}>
        <Animated.View
          style={[
            styles.card,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Pressable onPress={() => {}} accessible={false}>
            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Subtitle */}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              {/* Confirm */}
              <Pressable
                style={[
                  styles.button,
                  destructive ? styles.destructiveButton : styles.confirmButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={isLoading}
                accessibilityRole="button"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    {confirmLabel}
                  </Text>
                )}
              </Pressable>

              {/* Dismiss */}
              <Pressable
                style={[styles.button, styles.dismissButton]}
                onPress={handleDismiss}
                disabled={isLoading}
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, styles.dismissButtonText]}>
                  {dismissLabel}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#00394a",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(0,84,110,0.55)",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 48,
  },
  confirmButton: {
    backgroundColor: "#00394a",
  },
  destructiveButton: {
    backgroundColor: "#dc2626",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  dismissButton: {
    borderWidth: 1,
    borderColor: "rgba(0,57,74,0.18)",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  confirmButtonText: {
    color: "#ffffff",
  },
  dismissButtonText: {
    color: "#00394a",
  },
});
