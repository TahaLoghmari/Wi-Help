export type RegisterRole = "patient" | "professional";
export type RegistrationStep = 1 | 2 | 3;

export interface RegistrationFlowState {
  role: RegisterRole;
  step: RegistrationStep;
}

export type RegistrationFlowAction =
  | { type: "next" }
  | { type: "previous" }
  | { type: "set-role"; role: RegisterRole }
  | { type: "reset" };

export const initialRegistrationFlowState: RegistrationFlowState = {
  role: "patient",
  step: 1,
};

export function registrationFlowReducer(
  state: RegistrationFlowState,
  action: RegistrationFlowAction,
): RegistrationFlowState {
  switch (action.type) {
    case "next":
      return { ...state, step: state.step === 1 ? 2 : 3 };
    case "previous":
      return { ...state, step: state.step === 3 ? 2 : 1 };
    case "set-role":
      return { role: action.role, step: 1 };
    case "reset":
      return initialRegistrationFlowState;
  }
}
