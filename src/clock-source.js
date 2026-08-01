// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.

export function subscribe(onTick) {
  const intervalMs = 1000;

  // Support multiple concurrent subscriptions by keeping all timer state
  // local to this call.
  const intervalId = setInterval(() => {
    onTick(new Date());
  }, intervalMs);

  // Unsubscribe contract: synchronous, idempotency not required.
  return () => {
    clearInterval(intervalId);
  };
}
