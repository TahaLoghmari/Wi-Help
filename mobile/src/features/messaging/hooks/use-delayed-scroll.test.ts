import { act, renderHook } from "@testing-library/react-native";
import { useDelayedScroll } from "./use-delayed-scroll";

describe("useDelayedScroll", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("cancels a scheduled scroll when unmounted", async () => {
    const scroll = jest.fn();
    const { result, unmount } = await renderHook(() =>
      useDelayedScroll(scroll),
    );

    await act(() => result.current());
    await unmount();
    await act(() => jest.runAllTimers());

    expect(scroll).not.toHaveBeenCalled();
  });

  it("replaces a pending scroll when rescheduled", async () => {
    const scroll = jest.fn();
    const { result } = await renderHook(() => useDelayedScroll(scroll));

    await act(() => result.current());
    await act(() => jest.advanceTimersByTime(50));
    await act(() => result.current());
    await act(() => jest.advanceTimersByTime(50));

    expect(scroll).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(50));
    expect(scroll).toHaveBeenCalledTimes(1);
  });
});
