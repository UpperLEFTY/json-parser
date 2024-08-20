# JSON Parser

This project is a custom JSON parser built in TypeScript that supports backward compatibility with various legacy JSON formats. The parser can handle comments, trailing commas, single-quoted strings, and unquoted property names, making it suitable for scenarios where strict JSON compliance is not required.

## Features

	•	Standard JSON Parsing: Supports parsing of standard JSON structures.
	•	Backward Compatibility:
	•	Comments: Allows // and /* */ style comments within JSON.
	•	Trailing Commas: Supports trailing commas in objects and arrays.
	•	Single-Quoted Strings: Handles strings enclosed in single quotes.
	•	Unquoted Property Names: Accepts unquoted property names in objects.

## Usage

- You can use the parser to parse both standard and legacy JSON formats. Here’s how:
``` 
import { parseJSON } from './src/parser';

const json = '{"key": "value", "array": [1, 2, 3]}';
const parsedData = parseJSON(json);
console.log(parsedData);
// Output: { key: 'value', array: [1, 2, 3] }

- Parsing Legacy JSON Formats
import { parseJSON } from './src/parser';

// Example JSON strings
const jsonWithComments = '{/* comment */ "key": "value"}';
const jsonWithTrailingCommas = '{"key": "value",}';
const jsonWithSingleQuotes = "{'key': 'value'}";
const jsonWithUnquotedPropertyNames = '{key: "value"}';

// Parser options for backward compatibility
const options = {
    allowComments: true,
    allowTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowUnquotedPropertyNames: true
};

// Parsing legacy JSON formats
const parsedWithComments = parseJSON(jsonWithComments, options);
console.log(parsedWithComments); // Output: { key: 'value' }

const parsedWithTrailingCommas = parseJSON(jsonWithTrailingCommas, options);
console.log(parsedWithTrailingCommas); // Output: { key: 'value' }

const parsedWithSingleQuotes = parseJSON(jsonWithSingleQuotes, options);
console.log(parsedWithSingleQuotes); // Output: { key: 'value' }

const parsedWithUnquotedPropertyNames = parseJSON(jsonWithUnquotedPropertyNames, options);
console.log(parsedWithUnquotedPropertyNames); // Output: { key: 'value' }
  
```
## Installation

To use this parser in your project, follow these steps:

1. Clone the repository:

`git clone https://github.com/UpperLEFTY/json-parser.git`
`cd json-parser`

2. Install dependencies:
`npm install`

- Configuration Options

- The parser can be customized using the following options:

•	allowComments: (boolean) Enable to allow // and /* */ style comments in JSON.
•	allowTrailingCommas: (boolean) Enable to allow trailing commas in objects and arrays.
•	allowSingleQuotedStrings: (boolean) Enable to allow strings enclosed in single quotes.
•	allowUnquotedPropertyNames: (boolean) Enable to allow unquoted property names in objects.

- Example usage with options:
  const options = {
    allowComments: true,
    allowTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowUnquotedPropertyNames: true
};

const parsedData = parseJSON(yourJsonString, options);

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

json-parser/
├── src/
│   ├── tokenizer.ts         # Tokenizer logic for breaking JSON into tokens
│   ├── parser.ts            # Main parsing logic
│   └── index.ts             # Entry point of the parser
├── tests/
│   ├── tokenizer.test.ts    # Unit tests for the tokenizer
│   ├── parser.test.ts       # Unit tests for the parser
│   └── legacy-json/         # Sample legacy JSON files for testing
├── package.json             # NPM project metadata and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Running Tests
To run the tests and ensure everything is working as expected, use:

npm test

This command will run the unit tests for the tokenizer and parser. You should see output indicating that all tests have passed.

Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. Feel free to fork the project and submit a pull request with your improvements.

1.	Fork the repository
2.	Create a feature branch (git checkout -b feature/your-feature)
3.	Commit your changes (git commit -m 'Add some feature')
4.	Push to the branch (git push origin feature/your-feature)
5.	Open a pull request

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

For questions or suggestions, feel free to reach out via email at [](mailto:
