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

interface ParserOptions extends TokenizerOptions {}

export const tokenize = (json: string, options: ParserOptions = {}): Token[] => {
    const tokens: Token[] = [];
    let currentIndex = 0;

    function skipWhitespace() {
        while (currentIndex < json.length && /\s/.test(json[currentIndex])) {
            currentIndex++;
        }
    }

    const handleComment = (): boolean => {
        if (options.allowComments) {
            if (json[currentIndex] === '/' && json[currentIndex + 1] === '*') {
                currentIndex += 2;
                while (currentIndex < json.length && !(json[currentIndex] === '*' && json[currentIndex + 1] === '/')) {
                    currentIndex++;
                }
                currentIndex += 2;
                return true;
            } else if (json[currentIndex] === '/' && json[currentIndex + 1] === '/') {
                currentIndex += 2;
                while (currentIndex < json.length && json[currentIndex] !== '\n') {
                    currentIndex++;
                }
                currentIndex++;
                return true;
            }
        }
        return false;
    };

    const handleSingleQuotedString = (): boolean => {
        if (options.allowSingleQuotedStrings && json[currentIndex] === "'") {
            let endIndex = currentIndex + 1;
            while (endIndex < json.length && json[endIndex] !== "'") {
                endIndex++;
            }
            if (endIndex >= json.length) {
                throw new Error('Unterminated single-quoted string');
            }
            tokens.push({ type: 'string', value: json.substring(currentIndex, endIndex + 1) });
            currentIndex = endIndex + 1;
            return true;
        }
        return false;
    };

    const handleUnquotedPropertyName = (): boolean => {
        if (options.allowUnquotedPropertyNames && /[a-zA-Z_]/.test(json[currentIndex])) {
            let endIndex = currentIndex;
            while (endIndex < json.length && /[\w$]/.test(json[endIndex])) {
                endIndex++;
            }
            tokens.push({ type: 'identifier', value: json.substring(currentIndex, endIndex) });
            currentIndex = endIndex;
            return true;
        }
        return false;
    };

    const handlePunctuation = (): boolean => {
        const char = json[currentIndex];
        if ('{}:,[]'.includes(char)) {
            tokens.push({ type: char, value: char });
            currentIndex++;
            return true;
        }
        return false;
    };

    const handleNull = (): boolean => {
        if (json[currentIndex] === 'n' && json.substring(currentIndex, currentIndex + 4) === 'null') {
            tokens.push({ type: 'null', value: 'null' });
            currentIndex += 4;
            return true;
        }
        return false;
    };

    const handleBooleans = (): boolean => {
        if (json[currentIndex] === 't' && json.substring(currentIndex, currentIndex + 4) === 'true') {
            tokens.push({ type: 'boolean', value: 'true' });
            currentIndex += 4;
            return true;
        }
        if (json[currentIndex] === 'f' && json.substring(currentIndex, currentIndex + 5) === 'false') {
            tokens.push({ type: 'boolean', value: 'false' });
            currentIndex += 5;
            return true;
        }
        return false;
    };

    const handleString = (): boolean => {
        if (json[currentIndex] === '"') {
            let endIndex = currentIndex + 1;
            while (endIndex < json.length && json[endIndex] !== '"') {
                if (json[endIndex] === '\\' && endIndex + 1 < json.length) {
                    endIndex += 2;
                } else {
                    endIndex++;
                }
            }
            if (endIndex >= json.length) {
                throw new Error('Unterminated double-quoted string');
            }
            tokens.push({ type: 'string', value: json.substring(currentIndex, endIndex + 1) });
            currentIndex = endIndex + 1;
            return true;
        }
        return false;
    };

    const handleNumber = (): boolean => {
        const char = json[currentIndex];
        if (/\d/.test(char) || (char === '-' && /\d/.test(json[currentIndex + 1]))) {
            let endIndex = currentIndex;
            while (endIndex < json.length && /[\d.eE+-]/.test(json[endIndex])) {
                endIndex++;
            }
            tokens.push({ type: 'number', value: json.substring(currentIndex, endIndex) });
            currentIndex = endIndex;
            return true;
        }
        return false;
    };

    while (currentIndex < json.length) {
        skipWhitespace();
        
        const handled = 
            handleComment() || 
            handleSingleQuotedString() || 
            handleUnquotedPropertyName() || 
            handlePunctuation() || 
            handleNull() || 
            handleBooleans() || 
            handleString() || 
            handleNumber();
        
        if (!handled) {
            throw new Error(`Unexpected token ${json[currentIndex]}`);
        }
    }

    return tokens;
};