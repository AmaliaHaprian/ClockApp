import { act, create } from "react-test-renderer";

import Clock from "./Clock";
import { subscribe } from "./clock-source";

jest.mock("./clock-source");

beforeEach(() => {
  jest.clearAllMocks();
});

test("subscribes on mount and renders a clock div", () => {
  subscribe.mockImplementation(() => jest.fn());

  let root;
  act(() => {
    root = create(<Clock />);
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
    root = create(<Clock />);
  });

  expect(subscribe).toHaveBeenCalledTimes(1);

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test("re-renders with the time passed to the subscribed callback", () => {
  const nextTime = new Date("2026-08-01T09:30:00");
  const unsubscribe = jest.fn();
  let handleTick;

  subscribe.mockImplementation((onTick) => {
    handleTick = onTick;
    return unsubscribe;
  });

  let root;
  act(() => {
    root = create(<Clock />);
  });

  act(() => {
    handleTick(nextTime);
  });

  expect(root.toJSON().children[0]).toBe(nextTime.toLocaleTimeString());

  act(() => {
    root.unmount();
  });

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
