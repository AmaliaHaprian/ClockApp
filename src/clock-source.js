// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.
export function subscribe(onTick) {
  let id = setInterval(() => onTick(new Date()), 1000);
  return function unsubscribe() {
    if (id !== null) {
      clearInterval(id);
      id = null;
    }
  };
}
