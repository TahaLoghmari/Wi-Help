import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import { WelcomeScreen } from "./welcome-screen";

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual("react-native");
  return { __esModule: true, default: { View } };
});

jest.mock("@/features/auth/hooks/use-bounce", () => ({
  useBounce: () => ({}),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

describe("WelcomeScreen", () => {
  it("emits login and registration intents", async () => {
    const onLogin = jest.fn();
    const onRegister = jest.fn();
    await render(
      <WelcomeScreen onLogin={onLogin} onRegister={onRegister} />,
    );

    const user = userEvent.setup();
    await user.press(
      screen.getByRole("button", { name: "auth.welcome.signIn" }),
    );
    await user.press(
      screen.getByRole("button", { name: "auth.welcome.getStarted" }),
    );

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});
