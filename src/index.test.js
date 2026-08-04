/** @jest-environment jsdom */

import { createRoot } from "react-dom/client";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => "mock-app");

describe("src/index bootstrap", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    createRoot.mockReset();
  });

  test("creates a root once for #root and renders App with it", async () => {
    const container = document.getElementById("root");
    const render = jest.fn();
    createRoot.mockReturnValue({ render });

    await import("./index");

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);

    const renderedElement = render.mock.calls[0][0];
    expect(renderedElement.type).toBe("mock-app");
    expect(renderedElement.props).toEqual({});
  });
});
