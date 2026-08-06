jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => "App");

describe("index entrypoint", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test("creates a root for #root and renders App exactly once", async () => {
    const render = jest.fn();
    const { createRoot } = await import("react-dom/client");
    createRoot.mockReturnValue({ render });

    await import("./index");

    const container = document.getElementById("root");
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(expect.objectContaining({ type: "App" }));
  });
});
