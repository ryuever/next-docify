import reduce from '../utils/reduce';
import { composeArgn } from '../src';

test('Simulate `composeArgn1` function', () => {
  const accuSum = (sum, args) => {
    const cur = reduce(args, (accum, cur) => accum + cur, 0);
    return sum + cur;
  };
  const accuMultiple = (sum, args) => {
    const cur = reduce(args, (accum, cur) => accum * cur);
    return sum + cur;
  };
  const accuMinus = (sum, args) => {
    const cur = reduce(args, (accum, cur) => accum - cur);
    return sum + cur;
  };

  const fn = composeArgn(1, accuSum, accuMultiple, accuMinus);
  const result = fn(4, [9, 4, 2]);
  expect(result).toBe(94);
});

test('with two arg preserved', () => {
  const fn1 = () => [1, 4];
  const fn2 = () => [3, 7];
  const fn3 = () => [4, 8];

  const fn = composeArgn(2, fn1, fn2, fn3);
  const result = fn(3, 4, 5);
  expect(result).toEqual([4, 8]);
});
