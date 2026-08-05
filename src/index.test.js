jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => "mock-app");

describe("src/index bootstrap", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test("creates a React 18 root once for #root and renders App into it", async () => {
    const render = jest.fn();
    const { createRoot } = await import("react-dom/client");
    createRoot.mockReturnValue({ render });

    await import("./index");

    const container = document.getElementById("root");
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(expect.objectContaining({ type: "mock-app" }));
  });

  test("preserves the root mount target id and does not fall back to another container", async () => {
    const render = jest.fn();
    const { createRoot } = await import("react-dom/client");
    createRoot.mockReturnValue({ render });
    document.body.innerHTML = '<div id="other"></div><div id="root"></div>';

    await import("./index");

    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(createRoot).not.toHaveBeenCalledWith(document.getElementById("other"));
  });
});
