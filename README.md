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

In folder `examples/simple` there is an example of using this lib with Uniswap-clone contract. It repeats steps from [lesson 10](https://plutus-pioneer-program.readthedocs.io/en/latest/pioneer/week10.html) of the plutus-pioneer-program. 

To run the example, you first need to run the PAB from lesson 10 ([instruction](https://github.com/input-output-hk/plutus-pioneer-program)).

```bash
  npm run example
```

The `examples/uniswap-playground` folder contains the Uniswap playground. Installation and usage - [README](https://github.com/fullstack-development/pab-api-js/tree/main/examples/uniswap-playground) 

## Development

To bundle the result code, run

```bash
  npm run build
```

For tests, you first need to run PAB with any contract

```bash
  npm run test
```
