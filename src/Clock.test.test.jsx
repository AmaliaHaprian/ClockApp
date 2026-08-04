import React from "react";
import renderer, { act } from "react-test-renderer";

import Clock from "./Clock";
import { subscribe } from "./clock-source";

jest.mock("./clock-source");

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

  act(() => {
    root.unmount();
  });
});
