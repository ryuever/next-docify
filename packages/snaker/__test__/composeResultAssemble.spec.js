import reduce from '../src/utils/reduce';
import { composeResultAssemble } from '../src';

test('Function result will be joined with dash', () => {
  const sum = args => reduce(args, (accum, cur) => accum + cur, 0);
  const multiple = args => reduce(args, (accum, cur) => accum * cur);
  const minus = args => reduce(args, (accum, cur) => accum - cur);

  const fn = composeResultAssemble(sum, multiple, minus, results =>
    results.join('-')
  );
  const result = fn([9, 4, 2]);
  expect(result).toBe('15-72-3');
});
