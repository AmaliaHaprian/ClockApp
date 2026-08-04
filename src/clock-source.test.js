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

test("unsubscribe is idempotent and clears only its own interval", () => {
  const firstTick = jest.fn();
  const secondTick = jest.fn();

  const unsubscribeFirst = subscribe(firstTick);
  const unsubscribeSecond = subscribe(secondTick);

  jest.advanceTimersByTime(1000);
  unsubscribeFirst();
  unsubscribeFirst();
  jest.advanceTimersByTime(2000);

  expect(firstTick).toHaveBeenCalledTimes(1);
  expect(secondTick).toHaveBeenCalledTimes(3);

  unsubscribeSecond();
  jest.advanceTimersByTime(2000);

  expect(secondTick).toHaveBeenCalledTimes(3);
});
