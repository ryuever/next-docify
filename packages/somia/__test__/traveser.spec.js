import Traverser from '../src/Traverser';

const data = [
  {
    id: 'first',
    name: 'first',
    children: [
      {
        id: 'first-1',
        name: 'first-1',
      },
      {
        id: 'first-2',
        name: 'first-2',
      },
      {
        id: 'first-3',
        name: 'first-3',
        children: [
          {
            id: 'first-3-1',
            name: 'first-3-1',
          },
          {
            id: 'first-3-2',
            name: 'first-3-2',
            children: [
              {
                id: 'first-3-2-1',
                name: 'first-3-2-1',
              },
            ],
          },
        ],
      },
    ],
  },
];

test('test meta data', () => {
  const traverser = new Traverser({ data });
  const meta = traverser.resolveMeta();
  const simulatedResult = {
    first: { parent: [] },
    'first-1': { parent: ['first'] },
    'first-2': { parent: ['first'] },
    'first-3': { parent: ['first'] },
    'first-3-1': { parent: ['first', 'first-3'] },
    'first-3-2': { parent: ['first', 'first-3'] },
    'first-3-2-1': { parent: ['first', 'first-3', 'first-3-2'] },
  };

  expect(meta).toEqual(simulatedResult);
});

test('retrieveUp testing', () => {
  const traverser = new Traverser({ data });
  const result = traverser.retrieveUp('first-3-2-1');

  const simulatedResult = {
    id: 'first',
    name: 'first',
    children: [
      {
        id: 'first-3',
        name: 'first-3',
        children: [
          {
            id: 'first-3-2',
            name: 'first-3-2',
            children: [],
          },
        ],
      },
    ],
  };

  expect(result).toEqual(simulatedResult);
});

test('retrieve testing', () => {
  const traverser = new Traverser({ data });
  const result = traverser.retrieve('first-3-2');

  const simulatedResult = {
    id: 'first-3-2',
    name: 'first-3-2',
    children: [
      {
        id: 'first-3-2-1',
        name: 'first-3-2-1',
      },
    ],
  };

  expect(result).toEqual(simulatedResult);
});

test('retrieve leaf node will return itself', () => {
  const traverser = new Traverser({ data });
  const result = traverser.retrieve('first-3-2-1');

  const simulatedResult = {
    id: 'first-3-2-1',
    name: 'first-3-2-1',
  };

  expect(result).toEqual(simulatedResult);
});

test('query', () => {
  const traverser = new Traverser({ data });
  const result = traverser.query({
    name: 'first-3',
  });

  const simulatedResult = [
    {
      id: 'first-3',
      name: 'first-3',
      children: [
        {
          id: 'first-3-1',
          name: 'first-3-1',
        },
        {
          id: 'first-3-2',
          name: 'first-3-2',
          children: [
            {
              id: 'first-3-2-1',
              name: 'first-3-2-1',
            },
          ],
        },
      ],
    },
  ];

  expect(result).toEqual(simulatedResult);
});
