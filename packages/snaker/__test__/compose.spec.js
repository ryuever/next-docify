import reduce from '../src/utils/reduce';
import { compose } from '../src';

test('Has no function, it should itself', () => {
  const fn = compose();
  const result = fn(3);

  expect(result).toBe(3);
});

test('Only one function, it should return with its execute result', () => {
  const sum = args => reduce(args, (accum, cur) => accum + cur, 0);
  const fn = compose(sum);
  const result = fn([1, 2, 3]);

  expect(result).toBe(6);
});

test('The previous exec result should be feed into next function', () => {
  const addName = profile => Object.assign({}, profile, { name: 'ryu' });
  const addLocation = profile =>
    Object.assign({}, profile, { location: 'shanghai' });

  const fn = compose(addName, addLocation);
  const info = fn({});
  expect(info).toEqual({
    name: 'ryu',
    location: 'shanghai',
  });
});

test('Running order should be left to right', () => {
  const pushFirst = result => [].concat(result, 'first');
  const pushSecond = result => [].concat(result, 'second');
  const pushThird = result => [].concat(result, 'third');

  const fn = compose(pushFirst, pushSecond, pushThird);
  const accum = fn([]);
  expect(accum).toEqual(['first', 'second', 'third']);
});
