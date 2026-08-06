// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.
export function subscribe(onTick) {
  const intervalId = setInterval(() => onTick(new Date()), 1000);
  let isUnsubscribed = false;

  return function unsubscribe() {
    if (isUnsubscribed) {
      return;
    }

    isUnsubscribed = true;
    clearInterval(intervalId);
  };
}
