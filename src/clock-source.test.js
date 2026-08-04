import { subscribe } from "./clock-source";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("subscribe is exported and returns an unsubscribe function", () => {
  const unsubscribe = subscribe(jest.fn());

  expect(typeof subscribe).toBe("function");
  expect(typeof unsubscribe).toBe("function");
});

test("subscribe calls back with a Date on each tick", () => {
  const onTick = jest.fn();
  subscribe(onTick);

  jest.advanceTimersByTime(3000);

  expect(onTick).toHaveBeenCalledTimes(3);
  expect(onTick.mock.calls[0][0]).toBeInstanceOf(Date);
  expect(onTick.mock.calls[1][0]).toBeInstanceOf(Date);
  expect(onTick.mock.calls[2][0]).toBeInstanceOf(Date);
});

test("unsubscribe stops further ticks", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);
  unsubscribe();
  jest.advanceTimersByTime(5000);

  expect(onTick).toHaveBeenCalledTimes(1);
});

test("unsubscribe is safe to call multiple times", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);

  expect(() => {
    unsubscribe();
    unsubscribe();
    unsubscribe();
  }).not.toThrow();

  jest.advanceTimersByTime(5000);

  expect(onTick).toHaveBeenCalledTimes(1);
});
