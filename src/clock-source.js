// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.
export function subscribe(onTick) {
  const id = setInterval(() => onTick(new Date()), 1000);
  let didUnsubscribe = false;

  return function unsubscribe() {
    if (didUnsubscribe) {
      return;
    }
    didUnsubscribe = true;
    clearInterval(id);
  };
}
