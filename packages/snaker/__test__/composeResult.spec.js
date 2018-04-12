import reduce from '../utils/reduce';
import { composeResult } from '../src';

test('basic works', () => {
  const sum = args => reduce(args, (accum, cur) => accum + cur, 0);
  const multiple = args => reduce(args, (accum, cur) => accum * cur);
  const minus = args => reduce(args, (accum, cur) => accum - cur);

  const fn = composeResult(sum, multiple, minus);
  const result = fn([9, 4, 2]);

  expect(result[0]).toBe(15);
  expect(result[1]).toBe(72);
  expect(result[2]).toBe(3);
});
