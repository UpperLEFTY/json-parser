import { tokenize } from '../src/tokenizer';

describe('Tokenizer', () => {
  it('should tokenize a simple JSON string', () => {
    const json = '{"key": "value"}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"key"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"value"' },
      { type: '}', value: '}' },
    ]);
  });
});