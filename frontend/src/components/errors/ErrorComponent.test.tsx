import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorComponent } from "./ErrorComponent";

const goBack = vi.fn();
const goToHome = vi.fn();

vi.mock("@/hooks", () => ({
  useAppNavigation: () => ({ goBack, goToHome }),
}));

describe("ErrorComponent", () => {
  it("navigates home when the user selects Go Home", async () => {
    const user = userEvent.setup();
    render(<ErrorComponent showBackButton={false} />);

    await user.click(screen.getByRole("button", { name: "Go Home" }));

    expect(goToHome).toHaveBeenCalledOnce();
    expect(goBack).not.toHaveBeenCalled();
  });
});
