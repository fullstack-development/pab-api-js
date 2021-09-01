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

In folder `example` there is an example of usage this lib with Uniswap-clone contract. It repeats steps from lesson 10 of plutus-pioneer-program https://plutus-pioneer-program.readthedocs.io/en/latest/pioneer/week10.html. 

To run the example, you first need to run PAB from lesson 10 https://github.com/input-output-hk/plutus-pioneer-program or plutus-pab from plutus repo https://github.com/input-output-hk/plutus/tree/master/plutus-pab (command `cabal run plutus-uniswap`)

```bash
  npm run example
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
