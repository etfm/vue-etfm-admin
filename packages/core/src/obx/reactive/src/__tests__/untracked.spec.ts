import { untracked, observable, autorun } from '..';
import { test, expect, vi } from 'vitest';

test('basic untracked', () => {
  const obs = observable<any>({});
  const fn = vi.fn();
  autorun(() => {
    untracked(() => {
      fn(obs.value);
    });
  });

  expect(fn).toBeCalledTimes(1);
  obs.value = 123;
  expect(fn).toBeCalledTimes(1);
});

test('no params untracked', () => {
  untracked();
});
