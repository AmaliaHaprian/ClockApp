import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// React 16 render entrypoint (ReactDOM.render, pre-createRoot). Out of the T9
// demo unit's scope -- the demo unit only touches Clock.jsx.
ReactDOM.render(<App />, document.getElementById("root"));
