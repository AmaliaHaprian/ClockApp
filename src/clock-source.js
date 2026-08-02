// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.
export function subscribe(onTick) {
  // Create an independent interval per subscription.
  const id = setInterval(() => onTick(new Date()), 1000);

  // Ensure cleanup is safe/idempotent (calling multiple times does nothing harmful).
  return function unsubscribe() {
    clearInterval(id);
  };
}
