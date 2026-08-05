// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.
const TICK_INTERVAL_MS = 1000;

export function subscribe(onTick) {
  let intervalId = setInterval(() => onTick(new Date()), TICK_INTERVAL_MS);

  return function unsubscribe() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
