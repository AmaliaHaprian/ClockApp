import React from "react";
import { act } from "react-dom/test-utils";
import { subscribe } from "./clock-source";

describe("clock-source subscribe", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("subscribe calls back with a Date on each tick", () => {
    const onTick = jest.fn();
    subscribe(onTick);

    jest.advanceTimersByTime(3000);

    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onTick.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  test("unsubscribe stops further ticks", () => {
    const onTick = jest.fn();
    const unsubscribe = subscribe(onTick);

    jest.advanceTimersByTime(1000);
    unsubscribe();
    jest.advanceTimersByTime(5000);

    expect(onTick).toHaveBeenCalledTimes(1);
  });

  test("unsubscribe is idempotent (can be called multiple times)", () => {
    const onTick = jest.fn();
    const unsubscribe = subscribe(onTick);

    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(1);

    expect(() => unsubscribe()).not.toThrow();
    expect(() => unsubscribe()).not.toThrow();

    jest.advanceTimersByTime(5000);
    expect(onTick).toHaveBeenCalledTimes(1);
  });

  test("multiple subscriptions are independent (no cross-talk)", () => {
    const onTick1 = jest.fn();
    const onTick2 = jest.fn();

    const unsubscribe1 = subscribe(onTick1);
    const unsubscribe2 = subscribe(onTick2);

    jest.advanceTimersByTime(2000);

    expect(onTick1).toHaveBeenCalledTimes(2);
    expect(onTick2).toHaveBeenCalledTimes(2);

    unsubscribe1();

    jest.advanceTimersByTime(3000);

    expect(onTick1).toHaveBeenCalledTimes(2);
    expect(onTick2).toHaveBeenCalledTimes(5);

    unsubscribe2();
  });

  test("StrictMode double-invoke pattern does not create duplicate active timers", () => {
    const calls = [];

    function ClockTestComponent() {
      React.useEffect(() => {
        const unsubscribe = subscribe((date) => {
          calls.push(date);
        });
        return unsubscribe;
      }, []);

      return null;
    }

    const root = document.createElement("div");
    document.body.appendChild(root);

    // Initial mount + StrictMode simulated remount.
    act(() => {
      const { createRoot } = require("react-dom/client");
      const r = createRoot(root);
      r.render(
        <React.StrictMode>
          <ClockTestComponent />
        </React.StrictMode>
      );
      // Store root globally so it isn't GC'd before we unmount.
      root.__r = r;
    });

    // React 18 StrictMode in development triggers effect setup/cleanup twice.
    // We validate that ticking advances the callback exactly once per tick,
    // not twice (which would indicate a leaked/duplicate subscription).
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // If StrictMode created duplicate timers due to cleanup issues, we'd see 6 calls.
    expect(calls).toHaveLength(3);

    act(() => {
      root.__r.unmount();
    });

    // After unmount, no more calls should occur.
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(calls).toHaveLength(3);

    document.body.removeChild(root);
  });
});
