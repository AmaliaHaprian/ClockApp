import { subscribe } from "./clock-source";

describe("subscribe", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("calls back with a Date on each 1-second tick", () => {
    const onTick = jest.fn();

    subscribe(onTick);

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

  test("returns an unsubscribe function that stops further ticks", () => {
    const onTick = jest.fn();

    const unsubscribe = subscribe(onTick);

    expect(unsubscribe).toEqual(expect.any(Function));

    jest.advanceTimersByTime(1000);
    unsubscribe();
    jest.advanceTimersByTime(5000);

    expect(onTick).toHaveBeenCalledTimes(1);
  });

  test("each subscription cleans up its own interval independently", () => {
    const firstTick = jest.fn();
    const secondTick = jest.fn();

    const unsubscribeFirst = subscribe(firstTick);
    const unsubscribeSecond = subscribe(secondTick);

    jest.advanceTimersByTime(1000);
    unsubscribeFirst();
    jest.advanceTimersByTime(2000);

    expect(firstTick).toHaveBeenCalledTimes(1);
    expect(secondTick).toHaveBeenCalledTimes(3);

    unsubscribeSecond();
  });
});
