import { subscribe } from "./clock-source";

describe("clock-source subscribe", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("subscribe remains callable with a single function argument", () => {
    const onTick = jest.fn();
    expect(() => subscribe(onTick)).not.toThrow();
  });

  test("each subscribe call creates independent intervals", () => {
    const onTickA = jest.fn();
    const onTickB = jest.fn();

    subscribe(onTickA);
    subscribe(onTickB);

    jest.advanceTimersByTime(2000);

    expect(onTickA).toHaveBeenCalledTimes(2);
    expect(onTickB).toHaveBeenCalledTimes(2);
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

  test("unsubscribe is safe to call more than once (idempotent cleanup)", () => {
    const onTick = jest.fn();
    const unsubscribe = subscribe(onTick);

    jest.advanceTimersByTime(1000);
    unsubscribe();
    unsubscribe();

    jest.advanceTimersByTime(5000);

    expect(onTick).toHaveBeenCalledTimes(1);
  });
});
