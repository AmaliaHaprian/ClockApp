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

test("unsubscribe is safe to call more than once", () => {
  const clearIntervalSpy = jest.spyOn(global, "clearInterval");
  const unsubscribe = subscribe(jest.fn());

  expect(() => {
    unsubscribe();
    unsubscribe();
  }).not.toThrow();

  expect(clearIntervalSpy).toHaveBeenCalledTimes(2);
});

test("subscribe uses a 1000ms interval", () => {
  const setIntervalSpy = jest.spyOn(global, "setInterval");

  subscribe(jest.fn());

  expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
});
