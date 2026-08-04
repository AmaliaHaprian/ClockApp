import React from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";

jest.mock("./Clock", () => {
  const MockClock = () => <div className="clock">Mock Clock</div>;
  MockClock.displayName = "Clock";
  return MockClock;
});

test("renders the heading and mounts Clock", () => {
  let root;
  act(() => {
    root = renderer.create(<App />);
  });

  const tree = root.toJSON();
  expect(tree.type).toBe("main");
  expect(root.root.findByType("h1").children).toEqual(["Sample App"]);
  expect(root.root.findByProps({ className: "clock" })).toBeTruthy();

  root.unmount();
});
