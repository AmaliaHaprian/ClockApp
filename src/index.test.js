import React from "react";

import { createRoot } from "react-dom/client";
import App from "./App";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => {
  function MockApp() {
    return React.createElement("div", { className: "app" }, "App");
  }

  return {
    __esModule: true,
    default: MockApp,
  };
});

describe("src/index", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    createRoot.mockReset();
  });

  test("creates one React 18 root for #root and renders App into it", () => {
    const container = document.getElementById("root");
    const render = jest.fn();

    createRoot.mockReturnValue({ render });

    jest.isolateModules(() => {
      require("./index");
    });

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);

    const renderedElement = render.mock.calls[0][0];

    expect(renderedElement.type).toBe(App);
    expect(renderedElement.props).toEqual({});
  });
});
