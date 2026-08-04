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

test("unsubscribe is idempotent across repeated cleanup calls", () => {
  const onTick = jest.fn();
  const unsubscribe = subscribe(onTick);

  jest.advanceTimersByTime(1000);
  unsubscribe();
  unsubscribe();
  jest.advanceTimersByTime(5000);

  expect(onTick).toHaveBeenCalledTimes(1);
});

test("repeated subscribe and unsubscribe cycles do not leak or duplicate intervals", () => {
  const firstTick = jest.fn();
  const firstUnsubscribe = subscribe(firstTick);

  jest.advanceTimersByTime(1000);
  firstUnsubscribe();
  jest.advanceTimersByTime(2000);

  const secondTick = jest.fn();
  const secondUnsubscribe = subscribe(secondTick);

  jest.advanceTimersByTime(3000);
  secondUnsubscribe();
  jest.advanceTimersByTime(2000);

  expect(firstTick).toHaveBeenCalledTimes(1);
  expect(secondTick).toHaveBeenCalledTimes(3);
  expect(firstTick.mock.calls[0][0]).toBeInstanceOf(Date);
  expect(secondTick.mock.calls[0][0]).toBeInstanceOf(Date);
});
