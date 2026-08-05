import { subscribe } from "./clock-source";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("subscribe returns an unsubscribe function and calls back with a Date every 1000ms", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  expect(typeof unsubscribe).toBe("function");

  jest.advanceTimersByTime(999);
  expect(onTick).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(onTick).toHaveBeenCalledTimes(1);
  expect(onTick.mock.calls[0][0]).toBeInstanceOf(Date);

  jest.advanceTimersByTime(2000);
  expect(onTick).toHaveBeenCalledTimes(3);
  expect(onTick.mock.calls[1][0]).toBeInstanceOf(Date);
  expect(onTick.mock.calls[2][0]).toBeInstanceOf(Date);
});

test("unsubscribe stops further ticks and is safe to call more than once", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);
  expect(onTick).toHaveBeenCalledTimes(1);

  unsubscribe();
  unsubscribe();
  jest.advanceTimersByTime(5000);

  expect(onTick).toHaveBeenCalledTimes(1);
});
