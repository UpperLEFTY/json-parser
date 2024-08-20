import { tokenize, Token } from './tokenizer';

interface ParserOptions {
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
    allowSingleQuotedStrings?:  boolean;
    allowUnquotedPropertyNames?: boolean;
}



export function parseJSON(json: string, options: ParserOptions = {}): any {
    const tokens = tokenize(json, options);
    return parseTokens(tokens, options);
}

// Main function to parse tokens into JSON structure recursively
function parseTokens(tokens: Token[], parserOptions: ParserOptions): any {
    const token = tokens[0]; // Lookahead instead of shift
    if (!token) throw new Error('Unexpected end of input');

    switch (token.type) {
        case '{':
            tokens.shift();
            return parseObject(tokens, parserOptions);
        case '[':
            tokens.shift();
            return parseArray(tokens, parserOptions);
        case 'number':
        case 'string':
        case 'boolean':
        case 'null':
            const primitiveToken = tokens.shift();
            if (!primitiveToken) throw new Error('Unexpected end of input');
            return parsePrimitive(primitiveToken); // Parse and return primitive
        default:
            throw new Error(`Unexpected token ${token?.value}`);
    }
}

function parsePrimitive(token: Token): any {
    switch (token.type) {
        case 'number':
            return Number(token.value);
        case 'string':
        case 'quotedString':
            return token.value.slice(1, -1); // Remove quotes
        case 'boolean':
            return token.value === 'true';
        case 'null':
            return null;
        default:
            throw new Error(`Unexpected primitive token ${token.value}`);
    }
}

// Parsing functions
function parseObject(tokens: Token[], options: ParserOptions): any {
    const obj: { [key: string]: any } = {};

    while (tokens.length) {
        let token = tokens.shift();
        if (token?.type === '}') break;

        // Handle property key
        let key = '';
        if (token?.type === 'string' || token?.type === 'quotedString') {
            key = token.value.slice(1, -1); // Remove quotes
        } else if (options.allowUnquotedPropertyNames && token?.type === 'identifier') {
            key = token.value;
        } else {
            throw new Error(`Unexpected token ${token?.value}, expected a property key`);
        }

        // Expect colon
        token = tokens.shift();
        if (token?.type !== ':') {
            throw new Error(`Expected ':' after property key, found ${token?.value}`);
        }

        // Parse value
        obj[key] = parseTokens(tokens, options);

        // Handle trailing comma
        token = tokens[0];
        if (token?.type === ',') {
            tokens.shift(); // Consume the comma
            token = tokens[0];
            if (token?.type === '}') tokens.shift(); // Handle trailing comma
        }
    }

    return obj;
}

function parseArray(tokens: Token[], options: ParserOptions): any[] {
    const arr: any[] = [];

    while (tokens.length) {
        let token = tokens[0];
        if (token?.type === ']') {
            tokens.shift();
            break;
        }

        arr.push(parseTokens(tokens, options));

        // Handle trailing comma
        token = tokens[0];
        if (token?.type === ',') {
            tokens.shift(); // Consume the comma
            token = tokens[0];
            if (token?.type === ']') tokens.shift(); // Handle trailing comma
        }
    }

    return arr;
}

// Example JSON strings
const standardJSON = '{"key": "value", "array": [1, 2, 3]}';
const jsonWithComments = '{/* comment */ "key": "value"}';
const jsonWithTrailingCommas = '{"key": "value",}';
const jsonWithSingleQuotes = "{'key': 'value'}";
const jsonWithUnquotedPropertyNames = '{key: "value"}';

// Example options
const options = {
    allowComments: true,
    allowTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowUnquotedPropertyNames: true
};

// Parsing standard JSON
const parsedStandardJSON = parseJSON(standardJSON);
console.log(parsedStandardJSON); // Output: { key: 'value', array: [1, 2, 3] }

// Parsing JSON with comments
const parsedJSONWithComments = parseJSON(jsonWithComments, options);
console.log(parsedJSONWithComments); // Output: { key: 'value' }

// Parsing JSON with trailing commas
const parsedJSONWithTrailingCommas = parseJSON(jsonWithTrailingCommas, options);
console.log(parsedJSONWithTrailingCommas); // Output: { key: 'value' }

// Parsing JSON with single quotes
const parsedJSONWithSingleQuotes = parseJSON(jsonWithSingleQuotes, options);
console.log(parsedJSONWithSingleQuotes); // Output: { key: 'value' }

// Parsing JSON with unquoted property names
const parsedJSONWithUnquotedPropertyNames = parseJSON(jsonWithUnquotedPropertyNames, options);
console.log(parsedJSONWithUnquotedPropertyNames); // Output: { key: 'value' }