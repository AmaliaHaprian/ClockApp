import React from "react";

import { subscribe } from "./clock-source";

// THE DEMO UNIT'S TARGET. A React 16 class component that opens an external
// subscription in componentDidMount and tears it down in componentWillUnmount --
// the canonical lifecycle-to-hooks conversion the T9 Transformer performs
// (componentDidMount/componentWillUnmount -> a single useEffect with cleanup).
// The transformed form lives in fixture/canned/src/Clock.jsx.
export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { now: new Date() };
    this.handleTick = this.handleTick.bind(this);
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = subscribe(this.handleTick);
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      const unsubscribe = this.unsubscribe;
      this.unsubscribe = null;
      unsubscribe();
    }
  }

  handleTick(now) {
    this.setState({ now });
  }

  render() {
    return <div className="clock">{this.state.now.toLocaleTimeString()}</div>;
  }
}
