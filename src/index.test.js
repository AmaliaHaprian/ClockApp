jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => "mock-app");

describe("src/index bootstrap", () => {
  let createRoot;
  let render;
  let container;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById("root");
    render = jest.fn();
    ({ createRoot } = jest.requireMock("react-dom/client"));
    createRoot.mockReturnValue({ render });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  test("creates a React 18 root for the #root container and renders App", () => {
    jest.isolateModules(() => {
      jest.requireActual("./index");
    });

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render.mock.calls[0][0]).toMatchObject({
      type: "mock-app",
      props: {},
    });
  });

  test("reuses the created root for rendering instead of creating more than one root during bootstrap", () => {
    jest.isolateModules(() => {
      jest.requireActual("./index");
    });

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
