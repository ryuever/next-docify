import objectIncludes from '../src/utils/objectIncludes';

test('To be truthy', () => {
  const obj1 = {
    id: 'a',
    name: 'a1',
  };

  const obj2 = {
    id: 'a',
    name: 'a1',
    alias: 'a1',
  };

  expect(objectIncludes(obj2, obj1)).toBeTruthy();
});

test('To be truthy', () => {
  const obj1 = {
    id: 'a',
    name: 'a1',
  };

  const obj2 = {
    id: 'a',
    name: 'a1',
    alias: 'a1',
  };

  expect(objectIncludes(obj1, obj2)).toBeFalsy();
});
