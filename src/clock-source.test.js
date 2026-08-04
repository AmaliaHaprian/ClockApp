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

test("repeated subscribe and unsubscribe cycles do not leak timers", () => {
  const firstTick = jest.fn();
  const secondTick = jest.fn();

  const firstUnsubscribe = subscribe(firstTick);
  jest.advanceTimersByTime(1000);
  firstUnsubscribe();

  const secondUnsubscribe = subscribe(secondTick);
  jest.advanceTimersByTime(1000);
  secondUnsubscribe();
  jest.advanceTimersByTime(5000);

  expect(firstTick).toHaveBeenCalledTimes(1);
  expect(secondTick).toHaveBeenCalledTimes(1);
});

test("setup and cleanup can happen back to back without leaving duplicated intervals", () => {
  const firstEffectTick = jest.fn();
  const secondEffectTick = jest.fn();

  const firstCleanup = subscribe(firstEffectTick);
  firstCleanup();

  const secondCleanup = subscribe(secondEffectTick);
  jest.advanceTimersByTime(3000);
  secondCleanup();

  expect(firstEffectTick).not.toHaveBeenCalled();
  expect(secondEffectTick).toHaveBeenCalledTimes(3);
});
