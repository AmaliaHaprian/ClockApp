jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => "mock-app");

describe("application entry point", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  test("creates a root once for #root and renders App with the React 18 root API", async () => {
    document.body.innerHTML = '<div id="root"></div>';

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

  test("does not use the legacy ReactDOM.render bootstrap", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const reactDomRender = jest.fn();
    jest.doMock("react-dom", () => ({
      render: reactDomRender,
    }));

    const render = jest.fn();
    const { createRoot } = await import("react-dom/client");
    createRoot.mockReturnValue({ render });

    await import("./index");

    expect(reactDomRender).not.toHaveBeenCalled();
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
