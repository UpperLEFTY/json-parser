import { parseJSON } from './parser';
import * as fs from 'fs';

const parseJsonFile = (filePath: string): any => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read JSON file as string
    const jsonString: string = fs.readFileSync(filePath, 'utf8');
    if (!jsonString.trim()) {
      throw new Error('JSON file is empty or contains only whitespace');
    }

    // Parse JSON string using custom parser
    const parsedData: any = parseJSON(jsonString);
    
    // Return parsed data
    return parsedData;
  } catch (error: any) {
    console.error('Error parsing JSON file:', error.message);
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON syntax');
    }
    return null;
  }
};

// Example usage: Parse a legacy JSON file
const legacyJsonPath = './src/tests/sample-json/legacy-format.json';
const parsedLegacyData = parseJsonFile(legacyJsonPath);

if (parsedLegacyData) {
    console.log('Parsed Legacy JSON:', parsedLegacyData);
} else {
    console.error('Failed to parse JSON.');
}

// Exporting the parse function for use in other modules (optional)
export { parseJSON, parseJsonFile };