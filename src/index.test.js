jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(),
}));

jest.mock("./App", () => {
  const React = require("react");

  function App() {
    return React.createElement("div", { className: "app" }, "App");
  }

  return {
    __esModule: true,
    default: App,
  };
});

describe("src/index", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test("creates one React 18 root for #root and renders App into it", () => {
    const container = document.getElementById("root");
    const render = jest.fn();
    const { createRoot } = require("react-dom/client");

    createRoot.mockReturnValue({ render });

    require("./index");

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);

    const renderedElement = render.mock.calls[0][0];
    const App = require("./App").default;

    expect(renderedElement.type).toBe(App);
    expect(renderedElement.props).toEqual({});
  });
});
