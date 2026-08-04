import React from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";
import { subscribe } from "./clock-source";

jest.mock("./clock-source", () => ({
  subscribe: jest.fn(),
}));

describe("App", () => {
  let unsubscribe;

  beforeEach(() => {
    unsubscribe = jest.fn();
    subscribe.mockImplementation(() => unsubscribe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the heading and clock and cleans up subscriptions without warnings", () => {
    let root;

    act(() => {
      root = renderer.create(<App />);
    });

    expect(subscribe).toHaveBeenCalled();

    const tree = root.toJSON();
    expect(tree.type).toBe("main");
    expect(root.root.findByType("h1").children).toEqual(["Sample App"]);
    expect(root.root.findByProps({ className: "clock" })).toBeTruthy();

    act(() => {
      root.unmount();
    });

    expect(unsubscribe).toHaveBeenCalled();
  });
});
