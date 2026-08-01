import { subscribe } from "./clock-source";

test("subscribe ticks on an interval and unsubscribe stops it", () => {
  jest.useFakeTimers();
  const onTick = jest.fn();

  const unsubscribe = subscribe(onTick);
  jest.advanceTimersByTime(3000);
  expect(onTick).toHaveBeenCalledTimes(3);

  unsubscribe();
  jest.advanceTimersByTime(3000);
  expect(onTick).toHaveBeenCalledTimes(3);

  jest.useRealTimers();
});
