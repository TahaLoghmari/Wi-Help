import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import { AppHeader } from "./app-header";

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: { View },
    Extrapolation: { CLAMP: "clamp" },
    interpolate: () => 1,
    useAnimatedStyle: (factory: () => object) => factory(),
  };
});

describe("AppHeader", () => {
  it("emits semantic header actions", async () => {
    const onOpenNotifications = jest.fn();
    const onOpenProfile = jest.fn();

    await render(
      <AppHeader
        hasUnreadNotifications
        isOnNotifications={false}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={onOpenProfile}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Notifications" }));
    await user.press(screen.getByRole("button", { name: "Profile" }));

    expect(onOpenNotifications).toHaveBeenCalledTimes(1);
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it("disables the notification action on the notifications screen", async () => {
    const onOpenNotifications = jest.fn();

    await render(
      <AppHeader
        hasUnreadNotifications
        isOnNotifications
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={jest.fn()}
      />,
    );

    await userEvent
      .setup()
      .press(screen.getByRole("button", { name: "Notifications" }));

    expect(onOpenNotifications).not.toHaveBeenCalled();
  });
});
