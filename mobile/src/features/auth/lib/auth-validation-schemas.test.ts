import { loginFormSchema } from "./auth-validation-schemas";

describe("loginFormSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginFormSchema.safeParse({
        email: "patient@example.com",
        password: "correct-password",
      }).success,
    ).toBe(true);
  });

  it("rejects a password shorter than eight characters", () => {
    const result = loginFormSchema.safeParse({
      email: "patient@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Password must be at least 8 characters.",
      );
    }
  });
});
