# pab-api-js

JavaScript wrapper for PAB (Plutus Application Backend) API. Works in both the browser and on Node.js. Includes TypeScript types definitions.

## Installation

```bash
  npm install --save git+ssh://github.com/fullstack-development/pab-api-js.git
```

## Usage

```javascript
import { Pab } from 'pab-api-js';

const pab = new Pab('http://localhost:8080/');

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

For tests, you first need to run PAB from https://github.com/input-output-hk/plutus-starter, then run

```bash
  npm run test
```
