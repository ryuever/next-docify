import reduce from '../src/utils/reduce';
import { composeArg1 } from '../src';

test('calculate the sum of multiple `Elementary arithmetic`', () => {
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

  const fn = composeArg1(accuSum, accuMultiple, accuMinus);
  const result = fn(4, [9, 4, 2]);
  expect(result).toBe(94);
});
