import {
  HubConnectionBuilder,
  HubConnectionState,
  type HubConnection,
} from "@microsoft/signalr";
import { SignalRService } from "./signalr-service";

jest.mock("@microsoft/signalr", () => {
  const actual = jest.requireActual("@microsoft/signalr");
  return {
    ...actual,
    HubConnectionBuilder: jest.fn(),
  };
});

function createConnection() {
  return {
    state: HubConnectionState.Disconnected,
    start: jest.fn(async () => undefined),
    stop: jest.fn(async () => undefined),
    invoke: jest.fn(async () => undefined),
    on: jest.fn(),
    off: jest.fn(),
    onreconnecting: jest.fn(),
    onreconnected: jest.fn(),
    onclose: jest.fn(),
    serverTimeoutInMilliseconds: 0,
    keepAliveIntervalInMilliseconds: 0,
  } as unknown as HubConnection;
}

function mockConnectionBuilder(connection: HubConnection) {
  const builder = {
    withUrl: jest.fn(),
    withAutomaticReconnect: jest.fn(),
    configureLogging: jest.fn(),
    build: jest.fn(() => connection),
  };
  builder.withUrl.mockReturnValue(builder);
  builder.withAutomaticReconnect.mockReturnValue(builder);
  builder.configureLogging.mockReturnValue(builder);
  jest
    .mocked(HubConnectionBuilder)
    .mockImplementation(() => builder as unknown as HubConnectionBuilder);
}

describe("SignalRService", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects start failures through its public transport contract", async () => {
    const connection = createConnection();
    const failure = new Error("network unavailable");
    jest.mocked(connection.start).mockRejectedValue(failure);
    mockConnectionBuilder(connection);
    const service = new SignalRService({ hubPath: "/hubs/test" });
    const listener = jest.fn();
    service.onError(listener);

    await expect(service.start()).rejects.toBe(failure);
    expect(listener).toHaveBeenCalledWith({
      operation: "start",
      cause: failure,
    });
  });

  it("rejects invoke failures through its public transport contract", async () => {
    const connection = createConnection();
    const failure = new Error("send failed");
    mockConnectionBuilder(connection);
    const service = new SignalRService({ hubPath: "/hubs/test" });
    const listener = jest.fn();
    service.onError(listener);
    await service.start();
    Object.assign(connection, { state: HubConnectionState.Connected });
    jest.mocked(connection.invoke).mockRejectedValue(failure);

    await expect(service.invoke("SendMessage", "hello")).rejects.toBe(failure);
    expect(listener).toHaveBeenCalledWith({
      operation: "invoke",
      method: "SendMessage",
      cause: failure,
    });
  });
});
