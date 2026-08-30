import {
  isValidDateOfBirth,
  loginFormSchema,
} from "./auth-validation-schemas";

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

describe("date of birth validation", () => {
  const now = new Date(2026, 7, 30);

  it("uses the supplied date when rejecting future birth dates", () => {
    expect(isValidDateOfBirth("30/08/2026", now)).toBe(true);
    expect(isValidDateOfBirth("31/08/2026", now)).toBe(false);
  });

  it("rejects impossible calendar dates", () => {
    expect(isValidDateOfBirth("31/02/2020", now)).toBe(false);
  });
});
