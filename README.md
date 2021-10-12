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

### Examples

In folder `examples/simple` there is an example of using this lib with Uniswap-clone contract. It repeats steps from [lesson 10](https://plutus-pioneer-program.readthedocs.io/en/latest/pioneer/week10.html) of the plutus-pioneer-program. 

To run the example, you first need to run plutus-pab from plutus repo ([link](https://github.com/input-output-hk/plutus/tree/master/plutus-pab)), command `cabal run plutus-uniswap`.

```bash
  npm run example
```

The `examples/uniswap-playground` folder contains the Uniswap playground. Installation and usage - [README](https://github.com/fullstack-development/pab-api-js/tree/main/examples/uniswap-playground) 

### Documentation

To learn more about the uniswap example you can check the [documentation](./doc) folder.

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
