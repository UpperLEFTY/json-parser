import { tokenize, Token } from './tokenizer';

interface ParserOptions {
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
    allowSingleQuotedStrings?: boolean;
    allowUnquotedPropertyNames?: boolean;
}


export function parseJSON(json: string, options: ParserOptions = {}): any {
    // Avoid logging the entire JSON string
    if (process.env.NODE_ENV === 'development') {
        console.log('Parsing JSON input');
    }
    
  const tokens = tokenize(json, options);
  return parseTokens(tokens, options);
}

// Main function to parse tokens into JSON structure
function parseTokens(tokens: Token[], options: ParserOptions): any {
    const token = tokens.shift();
    if (!token) throw new Error('Unexpected end of input');

    if (token.type === '{') {
        return parseObject(tokens, options);
    } else if (token.type === '[') {
        return parseArray(tokens, options);
    } else {
        throw new Error(`Unexpected token ${token.value}`);
    }
}

// Parsing functions
function parseObject(tokens: Token[], options: ParserOptions): any {
    const obj: { [key: string]: any } = {};

    while (tokens.length) {
        let token = tokens.shift();
        if (token?.type === '}') break;

        // Handle property key
        let key = parsePropertyKey(token, options);

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

function parsePropertyKey(token: Token | undefined, options: ParserOptions): string {
    if (token?.type === 'string' || token?.type === 'quotedString') {
        return token.value.slice(1, -1); // Remove quotes
    } else if (options.allowUnquotedPropertyNames && token?.type === 'identifier') {
        return token.value;
    } else {
        throw new Error(`Unexpected token ${token?.value}, expected a property key`);
    }
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