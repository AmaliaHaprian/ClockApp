jest.mock("./App", () => "mock-app");
jest.mock("react-dom", () => ({
  createRoot: mockCreateRoot,
}));

const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

describe("src/index", () => {
  let rootElement;
  let documentMock;

  beforeEach(() => {
    jest.resetModules();
    mockRender.mockClear();
    mockCreateRoot.mockClear();
    rootElement = { id: "root" };
    documentMock = {
      getElementById: jest.fn((id) => (id === "root" ? rootElement : null)),
    };
    globalThis.document = documentMock;
  });

  test("creates a root once for the root container and renders App once", async () => {
    await import("./index");

    expect(documentMock.getElementById).toHaveBeenCalledTimes(1);
    expect(documentMock.getElementById).toHaveBeenCalledWith("root");
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender.mock.calls[0][0]).toMatchObject({ type: "mock-app", props: {} });
  });

  test("uses the React 18 root API instead of legacy ReactDOM.render", async () => {
    const reactDom = await import("react-dom");

    expect(reactDom.createRoot).toBe(mockCreateRoot);

    await import("./index");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
