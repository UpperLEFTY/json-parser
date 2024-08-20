/**
 * The possible values for the `type` property in the `Token` interface defined by the tokenizer implementation. The following values are used:
 *
 * 1. `{` - Represents the beginning of an object.
 * 2. `}` - Represents the end of an object.
 * 3. `[` - Represents the beginning of an array.
 * 4. `]` - Represents the end of an array.
 * 5. `number` - Represents a numeric value.
 * 6. `string` - Represents a string value.
 * 7. `quotedString` - Represents a quoted string value.
 * 8. `boolean` - Represents a boolean value (`true` or `false`).
 * 9. `null` - Represents a null value.
 * 10. `identifier` - Represents an unquoted property name (if allowed by options).
 * 11. `:` - Represents a colon, used in object key-value pairs.
 * 12. `,` - Represents a comma, used to separate elements in arrays or objects.
 *
 * 
 */

export interface Token {
    type: string;
    value: string;
}

interface TokenizerOptions {
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
    allowSingleQuotedStrings?: boolean;
    allowUnquotedPropertyNames?: boolean;
}

function parseString(json: string, index: number, options: TokenizerOptions): { token: Token, newIndex: number } {
    let value = '';
    index++; // Skip the initial quote

    while (index < json.length) {
        const char = json[index];
        if (char === '"') {
            index++; // Skip the closing quote
            break;
        }
        value += char;
        index++;
    }

    return { token: { type: 'string', value: `"${value}"` }, newIndex: index };
}

function parseWord(json: string, index: number, options: TokenizerOptions): { token: Token, newIndex: number } {
    let value = '';

    while (index < json.length) {
        const char = json[index];
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '{' || char === '}' || char === '[' || char === ']' || char === ':' || char === ',') {
            break;
        }
        value += char;
        index++;
    }

    let type: string;
    if (value === 'true' || value === 'false') {
        type = 'boolean';
    } else if (value === 'null') {
        type = 'null';
    } else if (!isNaN(Number(value))) {
        type = 'number';
    } else {
        type = 'identifier';
    }

    return { token: { type, value }, newIndex: index };
}

export function tokenize(json: string, options: TokenizerOptions = {}): Token[] {
    const tokens: Token[] = [];
    let index = 0;

    while (index < json.length) {
        const char = json[index];
        if (char === '{' || char === '}' || char === '[' || char === ']' || char === ':' || char === ',') {
            tokens.push({ type: char, value: char });
            index++;
        } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
            index++;
        } else if (char === '"') {
            const { token, newIndex } = parseString(json, index, options);
            tokens.push(token);
            index = newIndex;
        } else {
            const { token, newIndex } = parseWord(json, index, options);
            tokens.push(token);
            index = newIndex;
        }
    }

    return tokens;
}