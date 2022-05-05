# pab-api-js

JavaScript wrapper for PAB (Plutus Application Backend) API. Works in both the browser and on Node.js. Includes TypeScript types definitions.

## Installation

```bash
  npm install --save git+https://github.com/fullstack-development/pab-api-js.git
```

## Usage

```javascript
import { Pab } from 'pab-api-js';

const pab = new Pab('http://localhost:9080/');

const getReport = async () => {
  try {
    const result = await pab.getFullReport();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

getReport();

```

## Development

To bundle the result code, run

```bash
  npm run build
```

To format code (in folder src)

```bash
  npm run format
```

For tests, you first need to run PAB with any contract

```bash
  npm run test
```
