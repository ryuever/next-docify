import Parser from '../src/Parser';
import singleRoot from './data/singleRoot';
import multipleRoot from './data/multipleRoot';

test('single root parse', () => {
  const parser = new Parser({
    rawData: singleRoot,
  });

  const arr = [
    {
      value: 'tutorial',
      depth: 1,
      order: 0,
      children: [
        {
          value: 'quick-start(quick-start.md)',
          depth: 2,
          order: 0,
          children: [],
        },
        {
          value: 'API',
          depth: 2,
          order: 1,
          children: [
            {
              value: 'basic-functions(basic-functions.md)',
              depth: 3,
              order: 0,
              children: [],
            },
          ],
        },
      ],
    },
  ];

  const result = parser.parse();
  expect(arr).toEqual(result);
});

test('multiple root parse', () => {
  const parser = new Parser({
    rawData: multipleRoot,
  });

  const arr = [
    {
      value: 'tutorial',
      depth: 1,
      order: 0,
      children: [
        {
          value: 'quick-start(quick-start.md)',
          depth: 2,
          order: 0,
          children: [],
        },
        {
          value: 'API',
          depth: 2,
          order: 1,
          children: [
            {
              value: 'basic-functions(basic-functions.md)',
              depth: 3,
              order: 0,
              children: [],
            },
            {
              value: 'built-in(built-in.md)',
              depth: 3,
              order: 1,
              children: [],
            },
            {
              value: 'type(type.md)',
              depth: 3,
              order: 2,
              children: [],
            },
          ],
        },
      ],
    },
    {
      value: 'about',
      depth: 1,
      order: 1,
      children: [],
    },
    {
      value: 'docs',
      depth: 1,
      order: 2,
      children: [
        {
          value: 'hello(hello.md)',
          depth: 2,
          order: 0,
          children: [],
        },
      ],
    },
  ];

  const result = parser.parse();
  expect(arr).toEqual(result);
});
