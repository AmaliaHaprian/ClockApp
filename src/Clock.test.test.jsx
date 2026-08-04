import React from "react";
import renderer, { act } from "react-test-renderer";

import Clock from "./Clock";
import { subscribe } from "./clock-source";

jest.mock("./clock-source");

afterEach(() => {
  jest.clearAllMocks();
});

test("test(Clock): subscribes on mount and renders a clock div", () => {
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
  expect(root.toJSON().props.className).toBe("clock");

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
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

  expect(root.toJSON().children[0]).toBe(nextTime.toLocaleTimeString());

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
