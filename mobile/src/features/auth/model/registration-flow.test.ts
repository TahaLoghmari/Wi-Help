import {
  initialRegistrationFlowState,
  registrationFlowReducer,
} from "./registration-flow";

describe("registrationFlowReducer", () => {
  it("starts as a patient on step one", () => {
    expect(initialRegistrationFlowState).toEqual({
      role: "patient",
      step: 1,
    });
  });

  it("keeps next and previous within the registration steps", () => {
    let state = initialRegistrationFlowState;

    state = registrationFlowReducer(state, { type: "next" });
    state = registrationFlowReducer(state, { type: "next" });
    state = registrationFlowReducer(state, { type: "next" });
    expect(state.step).toBe(3);

    state = registrationFlowReducer(state, { type: "previous" });
    state = registrationFlowReducer(state, { type: "previous" });
    state = registrationFlowReducer(state, { type: "previous" });
    expect(state.step).toBe(1);
  });

  it("returns to step one when the role changes", () => {
    expect(
      registrationFlowReducer(
        { role: "patient", step: 3 },
        { type: "set-role", role: "professional" },
      ),
    ).toEqual({ role: "professional", step: 1 });
  });
});
