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

test("repeated setup and cleanup does not leak or duplicate intervals", () => {
  const firstOnTick = jest.fn();
  const secondOnTick = jest.fn();

  const firstUnsubscribe = subscribe(firstOnTick);
  jest.advanceTimersByTime(1000);
  firstUnsubscribe();
  firstUnsubscribe();

  const secondUnsubscribe = subscribe(secondOnTick);
  jest.advanceTimersByTime(3000);
  secondUnsubscribe();
  jest.advanceTimersByTime(3000);

  expect(firstOnTick).toHaveBeenCalledTimes(1);
  expect(secondOnTick).toHaveBeenCalledTimes(3);
});
