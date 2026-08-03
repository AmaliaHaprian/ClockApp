import { createRoot } from "react-dom/client";

import Clock from "./Clock";

// Plain functional shell. Out of the demo unit's scope; here only so Clock has
// a parent to render it.
export default function App() {
  return (
    <main>
      <h1>Sample App</h1>
      <Clock />
    </main>
  );
}

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
