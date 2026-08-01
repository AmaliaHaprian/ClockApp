// A tiny external "store" the Clock subscribes to. Out of the demo unit's
// scope -- it exists so the subscription lifecycle in Clock.jsx has something
// real to subscribe to and tear down.

/**
 * Subscribes to clock tick updates at 1-second intervals.
 * @param {Function} onTick - Callback invoked with the current Date on each tick
 * @returns {Function} Unsubscribe function that clears the interval
 */
export const subscribe = (onTick) => {
  const id = setInterval(() => onTick(new Date()), 1000);
  return () => clearInterval(id);
};
