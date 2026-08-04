import React, { StrictMode } from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";
import { subscribe } from "./clock-source";

jest.mock("./clock-source", () => ({
  subscribe: jest.fn(),
}));

describe("App", () => {
  let cleanup;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup = jest.fn();
    subscribe.mockImplementation(() => cleanup);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test("renders the heading and the Clock and cleans up subscriptions on unmount", () => {
    let root;

    act(() => {
      root = renderer.create(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    const tree = root.toJSON();
    expect(tree.type).toBe("main");
    expect(root.root.findByType("h1").children).toEqual(["Sample App"]);
    expect(root.root.findByProps({ className: "clock" })).toBeTruthy();
    expect(subscribe).toHaveBeenCalled();

    const subscribeCallsBeforeUnmount = subscribe.mock.calls.length;

    act(() => {
      root.unmount();
    });

    expect(cleanup).toHaveBeenCalledTimes(subscribeCallsBeforeUnmount);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
