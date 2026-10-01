import { fireEvent, render, screen } from "@testing-library/react-native";
import { Button } from "./button";

describe("Button", () => {
  it("invokes its action when pressed", async () => {
    const onPress = jest.fn();

    await render(<Button onPress={onPress}>Continue</Button>);
    fireEvent.press(screen.getByRole("button", { name: "Continue" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is unavailable while loading", async () => {
    await render(<Button loading>Continue</Button>);

    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });
});
