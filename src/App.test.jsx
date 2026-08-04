import React from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";
import { subscribe } from "./clock-source";

jest.mock("./clock-source", () => ({
  subscribe: jest.fn(),
}));

test("renders the heading and the Clock inside StrictMode", () => {
  let root;
  act(() => {
    root = renderer.create(<App />);
  });

  test("renders the heading and clock and cleans up subscriptions without warnings", () => {
    let root;

    act(() => {
      root = renderer.create(<App />);
    });

  act(() => {
    root.unmount();
  });
});
