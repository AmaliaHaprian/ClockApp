import React, { useEffect, useState } from "react";

import { subscribe } from "./clock-source";

// THE DEMO UNIT'S TARGET. A React 16 class component that opens an external
// subscription in componentDidMount and tears it down in componentWillUnmount --
// the canonical lifecycle-to-hooks conversion the T9 Transformer performs
// (componentDidMount/componentWillUnmount -> a single useEffect with cleanup).
// The transformed form lives in fixture/canned/src/Clock.jsx.
export default function Clock(props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const handleTick = (nextNow) => {
      setNow(nextNow);
    };

    const unsubscribe = subscribe(handleTick);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return <div className="clock">{now.toLocaleTimeString()}</div>;
}
