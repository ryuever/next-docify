import toSlug from '../toSlug';

test('Chinese character should be convert to pinyin', () => {
  const str = '开发文档';
  const result = toSlug(str);
  expect(result).toBe('kai-fa-wen-dang');
});

test('`str` seperator will be replaced with default connector `-`', () => {
  const str = '/Users/ryu/开发文档';
  const result = toSlug(str);
  expect(result).toBe('users-ryu-kai-fa-wen-dang');
});

test('On default, leading `connector` will be trimed', () => {
  const str = '/Users/ryu/开发文档';
  const result = toSlug(str);
  expect(result).toBe('users-ryu-kai-fa-wen-dang');
});

test('Set `trimLeadingConnector` as false to perserve leading `connector`', () => {
  const str = '/Users/ryu/开发文档';
  const result = toSlug(str, { trimLeadingConnector: false });
  expect(result).toBe('-users-ryu-kai-fa-wen-dang');
});

test('On default, trailing `connector` will be trimed', () => {
  const str = 'Users/ryu/开发文档/';
  const result = toSlug(str);
  expect(result).toBe('users-ryu-kai-fa-wen-dang');
});

test('Set `trimTrailingConnector` as false to perserve trailing `connector`', () => {
  const str = 'Users/ryu/开发文档/';
  const result = toSlug(str, { trimTrailingConnector: false });
  expect(result).toBe('users-ryu-kai-fa-wen-dang-');
});

test('Set `connector` as slash', () => {
  const str = 'Users/ryu/开发文档/';
  const result = toSlug(str, { connector: '/' });
  expect(result).toBe('users/ryu/kai-fa-wen-dang');
});

test('With custom dot', () => {
  const str = 'docify-chunks/.docify/tutorial/postmeta';
  const result = toSlug(str, { connector: '/' });
  expect(result).toBe('docify-chunks/.docify/tutorial/postmeta');
});
