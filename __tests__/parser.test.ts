import { parseJSON } from '../src/parser';

describe('parseJSON', () => {
  const options = {
    allowComments: true,
    allowTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowUnquotedPropertyNames: true
  };
  it('should parse standard JSON', () => {
    const json = '{"key": "value", "array": [1, 2, 3]}';
    const result = parseJSON(json);
    expect(result).toEqual({ key: 'value', array: [1, 2, 3] });
  });

  it('should parse JSON with comments', () => {
    const json = '{/* comment */ "key": "value"}';
    const result = parseJSON(json, options);
    expect(result).toEqual({ key: 'value' });
  });
  
  it('should parse JSON with trailing commas', () => {
    const json = '{"key": "value",}';
    const result = parseJSON(json, options);
    expect(result).toEqual({ key: 'value' });
  });

  it('should parse JSON with single quotes', () => {
    const json = "{'key': 'value'}";
    const result = parseJSON(json, options);
    expect(result).toEqual({ key: 'value' });
  });

  it('should parse JSON with unquoted property names', () => {
    const json = '{key: "value"}';
    const result = parseJSON(json, options);
    expect(result).toEqual({ key: 'value' });
  });

  it('should throw an error for unexpected token', () => {
    const json = '{"key": "value", "array": [1, 2, 3], "unexpected": @}';
    expect(() => parseJSON(json, options)).toThrow('Unexpected token @');
  });
});