import React, {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
} from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-brand-bg px-6 gap-4">
          <Ionicons
            name="warning-outline"
            size={48}
            color="rgba(0,84,110,0.3)"
          />
          <Text className="text-lg font-semibold text-brand-dark">
            Something went wrong
          </Text>
          <Text className="text-sm text-brand-secondary/60 text-center">
            An unexpected error occurred. Please try again.
          </Text>
          <Pressable
            onPress={this.handleReset}
            className="mt-4 px-6 py-3 bg-brand-dark rounded-full"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
