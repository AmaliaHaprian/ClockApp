import React from "react";

const mockCreateRoot = jest.fn();
const mockApp = () => React.createElement("div", { className: "app" }, "App");

jest.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

jest.mock("./App", () => ({
  __esModule: true,
  default: mockApp,
}));

describe("src/index", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    mockCreateRoot.mockReset();
  });

  test("creates one React 18 root for #root and renders App into it", async () => {
    const container = document.getElementById("root");
    const render = jest.fn();

    mockCreateRoot.mockReturnValue({ render });

    await import("./index");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);

    const renderedElement = render.mock.calls[0][0];

    expect(renderedElement.type).toBe(mockApp);
    expect(renderedElement.props).toEqual({});
  });
});
