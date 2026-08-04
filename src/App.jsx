import React, { StrictMode } from "react";

import Clock from "./Clock";

// Plain functional shell. Out of the demo unit's scope; here only so Clock has
// a parent to render it.
export default function App() {
  return (
    <StrictMode>
      <main>
        <h1>Sample App</h1>
        <Clock />
      </main>
    </StrictMode>
  );
}
