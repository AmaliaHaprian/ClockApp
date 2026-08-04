import React from "react";
import renderer, { act } from "react-test-renderer";

import App from "./App";

jest.mock("./Clock", () => function MockClock() {
  return <div className="clock">Mock Clock</div>;
});

test("renders the heading layout and hosts Clock as a child", () => {
  let root;
  act(() => {
    root = renderer.create(<App />);
  });

  const tree = root.toJSON();
  expect(tree.type).toBe("main");
  expect(root.root.findByType("h1").children).toEqual(["Sample App"]);
  expect(root.root.findByProps({ className: "clock" }).children).toEqual([
    "Mock Clock",
  ]);

  root.unmount();
});
