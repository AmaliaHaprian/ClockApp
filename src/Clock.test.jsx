import React, { StrictMode } from "react";
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
    root = renderer.create(<Clock />);
  });

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(root.toJSON().props.className).toBe("clock");

  act(() => {
    root.unmount();
  });
});

test("unsubscribes on unmount", () => {
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

test("re-renders with the time passed to the subscribed callback", () => {
  let handleTick;
  subscribe.mockImplementation((onTick) => {
    handleTick = onTick;
    return jest.fn();
  });

  let root;
  act(() => {
    root = renderer.create(<Clock />);
  });

  act(() => {
    handleTick(new Date("2026-08-01T09:30:00"));
  });

  expect(root.toJSON().children[0]).toBe(
    new Date("2026-08-01T09:30:00").toLocaleTimeString(),
  );
});

test("cleans up subscriptions correctly through React 18 StrictMode remounting", () => {
  const unsubscribes = [];
  subscribe.mockImplementation(() => {
    const unsubscribe = jest.fn();
    unsubscribes.push(unsubscribe);
    return unsubscribe;
  });

  let root;
  act(() => {
    root = renderer.create(
      <StrictMode>
        <Clock />
      </StrictMode>,
    );
  });

  act(() => {
    root.unmount();
  });

  expect(subscribe.mock.calls.length).toBeGreaterThanOrEqual(1);
  expect(unsubscribes).toHaveLength(subscribe.mock.calls.length);
  unsubscribes.forEach((unsubscribe) => {
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
