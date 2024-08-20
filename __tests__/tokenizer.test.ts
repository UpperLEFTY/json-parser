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
  it('should tokenize an empty JSON object', () => {
    const json = '{}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize a JSON object with a single key-value pair', () => {
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

  it('should tokenize a JSON array', () => {
    const json = '["value1", "value2"]';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '[', value: '[' },
      { type: 'string', value: '"value1"' },
      { type: ',', value: ',' },
      { type: 'string', value: '"value2"' },
      { type: ']', value: ']' },
    ]);
  });

  it('should tokenize nested JSON objects', () => {
    const json = '{"key": {"nestedKey": "nestedValue"}}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"key"' },
      { type: ':', value: ':' },
      { type: '{', value: '{' },
      { type: 'string', value: '"nestedKey"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"nestedValue"' },
      { type: '}', value: '}' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize JSON arrays with mixed types', () => {
    const json = '[1, "string", true, null]';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '[', value: '[' },
      { type: 'number', value: '1' },
      { type: ',', value: ',' },
      { type: 'string', value: '"string"' },
      { type: ',', value: ',' },
      { type: 'boolean', value: 'true' },
      { type: ',', value: ',' },
      { type: 'null', value: 'null' },
      { type: ']', value: ']' },
    ]);
  });

  it('should tokenize strings with escaped characters', () => {
    const json = '{"key": "value with \\"escaped\\" characters"}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"key"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"value with \\"escaped\\" characters"' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize strings with unicode characters', () => {
    const json = '{"key": "value with unicode \\u1234"}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"key"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"value with unicode \\u1234"' },
      { type: '}', value: '}' },
    ]);
  });

  it('should handle various whitespace characters', () => {
    const json = '{\n\t"key" : "value" \n}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"key"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"value"' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize JSON objects with trailing commas', () => {
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


it('should tokenize a JSON string with multiple types', () => {
  const json = '{"key": "value", "number": 42, "boolean": true, "null": null}';
  const tokens = tokenize(json);
  expect(tokens).toEqual([
    { type: '{', value: '{' },
    { type: 'string', value: '"key"' },
    { type: ':', value: ':' },
    { type: 'string', value: '"value"' },
    { type: ',', value: ',' },
    { type: 'string', value: '"number"' },
    { type: ':', value: ':' },
    { type: 'number', value: '42' },
    { type: ',', value: ',' },
    { type: 'string', value: '"boolean"' },
    { type: ':', value: ':' },
    { type: 'boolean', value: 'true' },
    { type: ',', value: ',' },
    { type: 'string', value: '"null"' },
    { type: ':', value: ':' },
    { type: 'null', value: 'null' },
    { type: '}', value: '}' },
  ]);
});


  it('should tokenize an empty string', () => {
    const json = '';
    const tokens = tokenize(json);
    expect(tokens).toEqual([]);
  });

  it('should tokenize integers, floats, and negative numbers', () => {
    const json = '{"int": 123, "float": 123.45, "negative": -123}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"int"' },
      { type: ':', value: ':' },
      { type: 'number', value: '123' },
      { type: ',', value: ',' },
      { type: 'string', value: '"float"' },
      { type: ':', value: ':' },
      { type: 'number', value: '123.45' },
      { type: ',', value: ',' },
      { type: 'string', value: '"negative"' },
      { type: ':', value: ':' },
      { type: 'number', value: '-123' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize boolean values', () => {
    const json = '{"trueValue": true, "falseValue": false}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"trueValue"' },
      { type: ':', value: ':' },
      { type: 'boolean', value: 'true' },
      { type: ',', value: ',' },
      { type: 'string', value: '"falseValue"' },
      { type: ':', value: ':' },
      { type: 'boolean', value: 'false' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize null value', () => {
    const json = '{"nullValue": null}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"nullValue"' },
      { type: ':', value: ':' },
      { type: 'null', value: 'null' },
      { type: '}', value: '}' },
    ]);
  });

  it('should tokenize strings with special characters', () => {
    const json = '{"special": "line\\nbreak\\ttab"}';
    const tokens = tokenize(json);
    expect(tokens).toEqual([
      { type: '{', value: '{' },
      { type: 'string', value: '"special"' },
      { type: ':', value: ':' },
      { type: 'string', value: '"line\\nbreak\\ttab"' },
      { type: '}', value: '}' },
    ]);
  });


