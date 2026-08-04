import React from "react";

const originalDocument = globalThis.document;

describe("src/index bootstrap", () => {
  let createRoot;
  let render;

  beforeEach(() => {
    jest.resetModules();

    render = jest.fn();
    createRoot = jest.fn(() => ({ render }));

    globalThis.document = {
      getElementById: jest.fn((id) => (id === "root" ? { id } : null)),
    };

    jest.doMock("react-dom/client", () => ({
      createRoot,
    }));

    jest.doMock("./App", () => ({
      __esModule: true,
      default: "mock-app",
    }));
  });

  afterEach(() => {
    globalThis.document = originalDocument;
    jest.dontMock("react-dom/client");
    jest.dontMock("./App");
  });

  test("creates a root once for #root and renders App with it", async () => {
    const container = globalThis.document.getElementById("root");

    await import("./index");

    expect(globalThis.document.getElementById).toHaveBeenCalledWith("root");
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);

    const renderedElement = render.mock.calls[0][0];
    expect(React.isValidElement(renderedElement)).toBe(true);
    expect(renderedElement.type).toBe("mock-app");
    expect(renderedElement.props).toEqual({});
  });
});
