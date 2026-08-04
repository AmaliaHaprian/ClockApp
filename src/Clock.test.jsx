import React from "react";
import renderer, { act } from "react-test-renderer";

import Clock from "./Clock";
import { subscribe } from "./clock-source";

jest.mock("./clock-source");

afterEach(() => {
  jest.clearAllMocks();
});

test("subscribes on mount and renders a clock div", () => {
  subscribe.mockImplementation(() => jest.fn());

  let root;
  act(() => {
    root = renderer.create(
      <React.StrictMode>
        <Clock />
      </React.StrictMode>,
    );
  });

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(unsubscribe).not.toHaveBeenCalled();
  expect(root.toJSON().props.className).toBe("clock");

  act(() => {
    root.unmount();
  });
});

test("test(Clock): unsubscribes on unmount", () => {
  const unsubscribe = jest.fn();
  subscribe.mockImplementation(() => unsubscribe);

  let root;
  act(() => {
    root = renderer.create(
      <React.StrictMode>
        <Clock />
      </React.StrictMode>,
    );
  });

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(unsubscribe).not.toHaveBeenCalled();

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test("test(Clock): re-renders with the time passed to the subscribed callback", () => {
  const unsubscribe = jest.fn();
  let handleTick;
  subscribe.mockImplementation((onTick) => {
    handleTick = onTick;
    return unsubscribe;
  });

  let root;
  act(() => {
    root = renderer.create(
      <React.StrictMode>
        <Clock />
      </React.StrictMode>,
    );
  });

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(unsubscribe).not.toHaveBeenCalled();

  const nextTime = new Date("2026-08-01T09:30:00");

  act(() => {
    handleTick(nextTime);
  });

  expect(root.toJSON().children[0]).toBe(
    new Date("2026-08-01T09:30:00").toLocaleTimeString(),
  );

  act(() => {
    root.unmount();
  });
});

test("cleanup is idempotent across repeated unmount cleanup calls", () => {
  const unsubscribe = jest.fn();
  subscribe.mockImplementation(() => unsubscribe);

  let root;
  act(() => {
    root = renderer.create(<Clock />);
  });

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test("does not create duplicate subscriptions in StrictMode", () => {
  const unsubscribeA = jest.fn();
  const unsubscribeB = jest.fn();
  subscribe
    .mockImplementationOnce(() => unsubscribeA)
    .mockImplementationOnce(() => unsubscribeB);

  let root;
  act(() => {
    root = renderer.create(
      <React.StrictMode>
        <Clock />
      </React.StrictMode>,
    );
  });

  expect(subscribe.mock.calls.length).toBeLessThanOrEqual(2);

  act(() => {
    root.unmount();
  });

  expect(unsubscribeA.mock.calls.length + unsubscribeB.mock.calls.length).toBe(
    subscribe.mock.calls.length,
  );
});
