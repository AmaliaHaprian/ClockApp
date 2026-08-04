import { subscribe } from "./clock-source";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("subscribe calls back with a Date on each tick", () => {
  const onTick = jest.fn();
  subscribe(onTick);

  jest.advanceTimersByTime(3000);

  expect(onTick).toHaveBeenCalledTimes(3);
  expect(onTick.mock.calls[0][0]).toBeInstanceOf(Date);
});

test("unsubscribe stops further ticks", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);
  unsubscribe();
  jest.advanceTimersByTime(5000);

  expect(onTick).toHaveBeenCalledTimes(1);
});

test("unsubscribe is idempotent and does not throw when called multiple times", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);
  expect(onTick).toHaveBeenCalledTimes(1);

  // First unsubscribe call
  expect(() => {
    unsubscribe();
  }).not.toThrow();

  // Second unsubscribe call (simulating StrictMode double-invoke)
  expect(() => {
    unsubscribe();
  }).not.toThrow();

  // Verify no additional callback invocations after multiple unsubscribes
  jest.advanceTimersByTime(5000);
  expect(onTick).toHaveBeenCalledTimes(1);
});
