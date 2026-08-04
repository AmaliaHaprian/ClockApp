jest.mock("./App", () => "mock-app");

const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

jest.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

describe("src/index", () => {
  let rootElement;

  beforeEach(() => {
    jest.resetModules();
    mockRender.mockClear();
    mockCreateRoot.mockClear();
    rootElement = { id: "root" };
    global.document = {
      getElementById: jest.fn((id) => (id === "root" ? rootElement : null)),
    };
  });

  test("creates a root once for the root container and renders App once", async () => {
    await import("./index");

    expect(document.getElementById).toHaveBeenCalledTimes(1);
    expect(document.getElementById).toHaveBeenCalledWith("root");
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender.mock.calls[0][0]).toMatchObject({ type: "mock-app", props: {} });
  });

  test("uses the React 18 root API instead of legacy ReactDOM.render", async () => {
    const reactDomClient = await import("react-dom/client");

    expect(reactDomClient.createRoot).toBe(mockCreateRoot);

    await import("./index");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
