import React from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";

jest.mock("./Clock", () => {
  const React = require("react");

  return function MockClock() {
    return <div className="clock">mock clock</div>;
  };
});

test("renders the heading and the Clock", () => {
  let root;
  act(() => {
    root = renderer.create(<App />);
  });

  const tree = root.toJSON();
  expect(tree.type).toBe("main");
  expect(root.root.findByType("h1").children).toEqual(["Sample App"]);
  expect(root.root.findByProps({ className: "clock" })).toBeTruthy();

  act(() => {
    root.unmount();
  });
});
