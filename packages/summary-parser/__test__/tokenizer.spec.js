import Tokenizer, { ValueToken } from '../src/Tokenizer';
import singleRoot from './data/singleRoot';
import multipleRoot from './data/multipleRoot';

test('single root tokenize', () => {
  const tokenizer = new Tokenizer({
    rawData: singleRoot,
  });

  const arr = [
    {
      value: 'tutorial',
      depth: 1,
    },
    {
      value: 'quick-start(quick-start.md)',
      depth: 2,
    },
    {
      value: 'API',
      depth: 2,
    },
    {
      value: 'basic-functions(basic-functions.md)',
      depth: 3,
    },
  ];

  const simulateResult = arr.map(item => new ValueToken(item));
  const resolvedResult = tokenizer.tokenize();
  expect(resolvedResult).toEqual(simulateResult);
});

test('multiple root tokenize', () => {
  const tokenizer = new Tokenizer({
    rawData: multipleRoot,
  });

  const arr = [
    {
      value: 'tutorial',
      depth: 1,
    },
    {
      value: 'quick-start(quick-start.md)',
      depth: 2,
    },
    {
      value: 'API',
      depth: 2,
    },
    {
      value: 'basic-functions(basic-functions.md)',
      depth: 3,
    },
    {
      value: 'built-in(built-in.md)',
      depth: 3,
    },
    {
      value: 'type(type.md)',
      depth: 3,
    },
    {
      value: 'about',
      depth: 1,
    },
    {
      value: 'docs',
      depth: 1,
    },
    {
      value: 'hello(hello.md)',
      depth: 2,
    },
  ];

  const simulateResult = arr.map(item => new ValueToken(item));
  const resolvedResult = tokenizer.tokenize();
  expect(resolvedResult).toEqual(simulateResult);
});

test('normalize string before feeding', () => {
  const tokenizer = new Tokenizer();
  const data = '<li><p></p></li>';

  const result = tokenizer.normalizeLine(data);
  expect(result).toBe('<li></li>');
});
