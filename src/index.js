import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// React 18 render entrypoint. Out of the T9 demo unit's scope -- the demo unit
// only touches Clock.jsx.
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(<App />);
