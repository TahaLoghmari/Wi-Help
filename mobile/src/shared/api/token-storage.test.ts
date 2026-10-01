jest.mock("expo-secure-store");

import * as SecureStore from "expo-secure-store";
import { tokenStorage } from "./token-storage";

describe("tokenStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores both tokens using the native secure store", async () => {
    await tokenStorage.setTokens("access-token", "refresh-token");

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
    );
  });
});
