# What is PAB

Plutus Application Backend (PAB) is a program that executes off-chain code of the smart-contract. You can learn about PAB [here](https://plutus.readthedocs.io/en/latest/plutus/explanations/pab.html).

# What is Uniswap

Uniswap is a DeFi application that allows swapping tokens or other digital assets without central authority. You can learn more about Uniswap protocol [here](https://docs.uniswap.org/protocol/introduction).

# Launch Uniswap PAB instance

First clone the `plutus` repository:

```bash
❯ git clone git@github.com:input-output-hk/plutus.git
```

Plutus uses Nix tools for development. Refer to the project's [README](https://github.com/input-output-hk/plutus#nix-advice) section about Nix setup to get all necessary tooling ready before starting.

After you've done all the steps start the nix shell in project folder:

```bash
❯ nix-shell
```

The first time launch might take a bit of time. If it takes more than 5mins then it might be you forgot to set up the needed caches to speed up the build. Refer to the [README](https://github.com/input-output-hk/plutus#nix-advice) instruction.

After some time you should see something like this in your shell:

```bash
[nix-shell:~/Projects/iohk/plutus]$
```

Now we're ready to build the Uniswap PAB instance. Simply run:

```bash
❯ cabal run plutus-pab:plutus-uniswap
```

This will build all the dependencies and binary for running the Uniswap. After build is complete you should see the contract logs that should look something like this:

```bash
[INFO] W2: Balancing an unbalanced transaction:
             Tx:
               Tx 34d13e4cbef5bc675d588a5f5ec4804d44a9487e3c0d54627d8a23c29c6bd230:
                 {inputs:
                    - b8cceb4768cc77d8d18a8b26d1122e8907660491d89862cb260b246b456b4c28!1
                      <<<<"", "">>,
                      <<"\215\135Z\215\131\153\222\150\DC4\152|@%\130\STX(\171S\182\a\222i\231\GSx\169\207Y",
                      "A">>>>
                 collateral inputs:
                 outputs:
                   - Value (Map [(,Map [("",100000)]),(05969c8ffafda0e0842dc33613f6d06980a8a5231bdd75e50a353304,Map [("Pool State",1)]),(d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59,Map [("A",500000)])]) addressed to
                     addressed to ScriptCredential: 9dd654153d1d3b0dee270789d0aa219481463e20148e523dfcd8eebc (no staking credential)
                   - Value (Map [(28db4965d376271c68b1221f20dfc383471e75f921b4fbde641b5beb,Map [("Uniswap",1)])]) addressed to
                     addressed to ScriptCredential: 9dd654153d1d3b0dee270789d0aa219481463e20148e523dfcd8eebc (no staking credential)
                 mint: Value (Map [(05969c8ffafda0e0842dc33613f6d06980a8a5231bdd75e50a353304,Map [("Pool State",1),(0x6e3058d4204fad57e07f14dbbe203dd2a57ed5bf89dc81a9338a252b8d82bf44,223607)])])
                 fee: Value (Map [])
                 mps:
                   MintingPolicy { <script> }
                 signatures:
                 validity range: Interval {ivFrom = LowerBound NegInf True, ivTo = UpperBound PosInf True}
                 data:
                   <[<<<"", "">>,
                   <<"\215\135Z\215\131\153\222\150\DC4\152|@%\130\STX(\171S\182\a\222i\231\GSx\169\207Y",
                   "A">>>]>
                   <<<<"", "">>,
                   <<"\215\135Z\215\131\153\222\150\DC4\152|@%\130\STX(\171S\182\a\222i\231\GSx\169\207Y",
                   "A">>>,
                   <223607>>
                   <[]>}
             Requires signatures:
             Utxo index:
               ( b8cceb4768cc77d8d18a8b26d1122e8907660491d89862cb260b246b456b4c28!1
               , - Value (Map [(28db4965d376271c68b1221f20dfc383471e75f921b4fbde641b5beb,Map [("Uniswap",1)])]) addressed to
                   addressed to ScriptCredential: 9dd654153d1d3b0dee270789d0aa219481463e20148e523dfcd8eebc (no staking credential) )
             Validity range:
               (-∞ , +∞)
[INFO] W2: Finished balancing. eeacde46c0335588b25394ef853749b15ddeb2aef43228af692120041d004713
[INFO] W2: Submitting tx: eeacde46c0335588b25394ef853749b15ddeb2aef43228af692120041d004713
[INFO] Slot 11: TxnValidate eeacde46c0335588b25394ef853749b15ddeb2aef43228af692120041d004713
[INFO] 0ed6ed46-df4f-47ce-83ff-efd7aef360dc: "created liquidity pool: LiquidityPool {lpCoinA = Coin {unCoin = (,\"\")}, lpCoinB = Coin {unCoin = (d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59,\"A\")}}"
[INFO] liquidity pool created
```

The Uniswap contract is ready and is accepting requests. You can check it by calling the health-check API:

```bash
❯ curl -v localhost:9080/api/healthcheck 
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 9080 (#0)
> GET /api/healthcheck HTTP/1.1
> Host: localhost:9080
> User-Agent: curl/7.64.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< Transfer-Encoding: chunked
< Date: Wed, 01 Sep 2021 07:46:47 GMT
< Server: Warp/3.3.17
< Content-Type: application/json;charset=utf-8
< 
* Connection #0 to host localhost left intact
[]* Closing connection 0
```

To stop the Uniswap runtime just simply press any key at the shell where you've launched the Uniswap:

```bash
...
[INFO] liquidity pool created

webserver: shutting down

[nix-shell:~/Projects/iohk/plutus/plutus-pab]$
```

# Install pab-api-js library

### Installation

Install pab-api-js to your javascript project

```bash
❯ npm install --save git+https://github.com/fullstack-development/pab-api-js.git
```

## Link to example file

[https://github.com/fullstack-development/pab-api-js/blob/main/examples/simple/index.js](https://github.com/fullstack-development/pab-api-js/blob/main/examples/simple/index.js)

## Run example

First clone pab-api-js

```bash
❯ git clone https://github.com/fullstack-development/pab-api-js.git
```

In folder `examples/simple` there is an example of using this lib with Uniswap-clone contract. It repeats steps from lesson 10 of the plutus-pioneer-program.

To run the example, you first need to run the PAB from lesson 10 ([instruction](https://github.com/input-output-hk/plutus-pioneer-program))

```bash
❯ npm run example
```

Each step with a description and some result will be displayed in the console. Below there is an example of output for two steps: Alice setting up a liquidity pool and Bob swaps tokens.

```bash
______________________________________________________
  
        Alice

  
Alice setting up a liquidity pool for 1000 tokens A and 2000 B tokens.

endpoint: create
body: {"cpAmountA":1000,"cpAmountB":2000,"cpCoinA":{"unAssetClass":[{"unCurrencySymbol":"973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"},{"unTokenName":"A"}]},"cpCoinB":{"unAssetClass":[{"unCurrencySymbol":"973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"},{"unTokenName":"B"}]}}

  
Query for pools.
┌─────────┬────────────────────────────────────────────────────────────┬───────────┬────────┐
│ (index) │                       currencySymbol                       │ tokenName │ amount │
├─────────┼────────────────────────────────────────────────────────────┼───────────┼────────┤
│    0    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │    'A'    │  1000  │
│    1    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │    'B'    │  2000  │
└─────────┴────────────────────────────────────────────────────────────┴───────────┴────────┘
We see that it has A and B and with the correct amounts, 1000 and 2000 respectively.

  
  
Press any key to continue

  ______________________________________________________
  
        Bob

  
Bob swaps 100A for Bs.

endpoint: swap
body: {"spAmountA":100,"spAmountB":0,"spCoinA":{"unAssetClass":[{"unCurrencySymbol":"973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"},{"unTokenName":"A"}]},"spCoinB":{"unAssetClass":[{"unCurrencySymbol":"973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"},{"unTokenName":"B"}]}}

  
Let’s check how many funds Bob now has. As expected, he has 100 fewer As and 181 as many Bs.
┌─────────┬────────────────────────────────────────────────────────────┬──────────────┬─────────────┐
│ (index) │                       currencySymbol                       │  tokenName   │   amount    │
├─────────┼────────────────────────────────────────────────────────────┼──────────────┼─────────────┤
│    0    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │     'A'      │   999900    │
│    1    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │     'B'      │   1000181   │
│    2    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │     'C'      │   1000000   │
│    3    │ '973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b' │     'D'      │   1000000   │
│    4    │                             ''                             │      ''      │ 99999988239 │
│    5    │ 'dddbfc53ad55ec8f96cc12edb6d2f0bc756989a7e613b190b7311b54' │ 'Pool State' │      0      │
└─────────┴────────────────────────────────────────────────────────────┴──────────────┴─────────────┘

  
  
Press any key to continue
```

# Example breakdown

## Connect to PAB

Before we begin we need to create an instance of `Pab` and provide the URL of running PAB web-server.

```jsx
// Import pab-api-js library
const { Pab } = require('pab-api-js');

// Create an instance of Pab that connects to a web-server running 
// on local port 9080
const pab = new Pab('http://localhost:9080/');

// Declare helper variables to hold information on AssetClass
// and wallets with contract instance ids
const SYMBOL = {};
const WALLETS = [];
const walletsNames = ['Alice', 'Bob', 'Charlie', 'Mary'];
```

## Get a list of contract instance ids

The Uniswap example creates contract instances for Wallet 1-4 as a part of launching sequence, to mint tokens a spread across all wallets. We need to get instance ids and map them with the wallets. Let's call `getContracts` method to receive a list of existing instances in PAB:

```jsx
const contracts = await pab.getContracts();
```

Now we need to iterate on the list of contracts and match them with our wallets:

```jsx
contracts.forEach((contract) => {
  const walletId = contract.cicWallet.getWalletId;
  const contractId = contract.cicContract.unContractInstanceId;
  if (WALLETS.some(({ id }) => id === walletId)) return;
  WALLETS.push({
    id: walletId,
    contractId,
    name: walletsNames[WALLETS.length],
  });
});
```

## Get currency symbol

Another thing that we need to do before we can start interacting with Uniswap contract is to record the Currency Symbol for tokens. We can do this by calling a `funds` endpoint. Let's find out what assets first wallet holds:

```jsx
const someContract = getContract('Alice');
await pab.callContractEndpoint(someContract)('funds', []);
```

The `callContractEndpoint` doesn't return the state of the blockchain in sync way. To get the latest state of a contract instance you need to poll for update state by calling `getContractStatus`:

```jsx
const status = await pab.getContractStatus(someContract);

SYMBOL.unCurrencySymbol = status.cicCurrentState.observableState.Right.contents.getValue.find(
  (el) => el[1].every((el) => ['A', 'B', 'C', 'D'].includes(el[0].unTokenName))
)?.[0].unCurrencySymbol;
```

And by that we get information on Alice Wallet assets that it holds:

```jsx
> JSON.stringify(status, null)
{
  "cicCurrentState": {
    "observableState": {
      "Right": {
        "contents": {
          "getValue": [
            [
              {
                "unCurrencySymbol": "06c0558017c0ae50d45ee06f08ba4e9cfb082b9df165cce2c472b8b9"
              },
              [[{ "unTokenName": "Uniswap" }, 0]]
            ],
            [
              {
                "unCurrencySymbol": "973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"
              },
              [
                [{ "unTokenName": "A" }, 1000000],
                [{ "unTokenName": "B" }, 1000000],
                [{ "unTokenName": "C" }, 1000000],
                [{ "unTokenName": "D" }, 1000000]
              ]
            ],
            [{ "unCurrencySymbol": "" }, [[{ "unTokenName": "" }, 99999990953]]]
          ]
        },
        "tag": "Funds"
      }
    },
    ...
}
```

We're interested in `A B C D` tokens and what currency symbol they have:

```jsx
[
  {
    "unCurrencySymbol": "973816f0528b9a78be74950ba6f07f8ef02b1a32113d12e4e4d3c06b"
  },
  [
    [{ "unTokenName": "A" }, 1000000],
    [{ "unTokenName": "B" }, 1000000],
    [{ "unTokenName": "C" }, 1000000],
    [{ "unTokenName": "D" }, 1000000]
  ]
],
```

## Create a pool

First let's check that we don't have any pool created on the blockchain. We will need to query the new state after each call of `funds` and `pools` . Let's try to automate this process by creating `getStatus` method:

```jsx
// contractId - is a contract Id of current wallet
// endpointName - is "pools" or "funds"
const getStatus = async (contractId, endpointName) => {
  // Make delay, because if previous endpoint request is not over,
	// we'll get error 500
	await makeDelay(2000);
  await pab.callContractEndpoint(contractId)(endpointName, []);

  // Make delay again and get status, witch contains list of pools or funds
  const status = await pab.getContractStatus(contractId);
  return status;
};
```

### Important note

If it was some kind of UUID that associates endpoint call with the received status, we will be able to get and process the correct result. For now we rely on delays and on the fact that the endpoint name is equal with the tag in the observableState. This example is simple and linear, so everything works well. But in other cases, this can lead to errors:
- Tag in `observableState.Right` may not be the same as endpoint name that was called before.
- `observableState.Left` has no tag at all. It is just error message.
- One of the solution would be to compare a status before the call and after, then wait until it is changed.

So if we had an UUID we could try to extend it with a method that waits up until the endpoint call to complete and return an observableState synchronously. It may look something like [this](https://github.com/fullstack-development/pab-api-js/blob/main/examples/uniswap-playground/utils/pab/callEndpoint.ts).

Now we can query pool status:

```jsx
const printPools = async (contractId) => {
  const status = await getStatus(contractId, 'pools');
  const table = [];

  status.cicCurrentState.observableState.Right.contents.forEach((el) => {
    el.forEach((el) => {
      table.push({
        currencySymbol: el[0].unAssetClass[0].unCurrencySymbol,
        tokenName: el[0].unAssetClass[1].unTokenName,
        amount: el[1],
      });
    });
  });

  if (table.length) console.table(table);
  else console.log('Result: no pools');
};
```

## Make a swap

Let's make swap for 100 A tokens for B for Bob's Wallet:

```jsx
const body = {
    spAmountA: 100,
    spAmountB: 0,
    spCoinA: { unAssetClass: [SYMBOL, { unTokenName: "A" }] },
    spCoinB: { unAssetClass: [SYMBOL, { unTokenName: "B" }] },
}

const CONTRACT = getContract('Bob');
await callAction(CONTRACT, 'swap', body);
> await printFunds(CONTRACT);

{
  "cicCurrentState": {
    "observableState": 
      "Right": {
        "contents": {
          "getValue": [
            [
              { "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59" },
              [
                [{ "unTokenName": "A" }, 499900],
                [{ "unTokenName": "B" }, 1000181],
                [{ "unTokenName": "C" }, 1000000],
                [{ "unTokenName": "D" }, 1000000]
              ]
            ],
            [{ "unCurrencySymbol": "" }, [[{ "unTokenName": "" }, 99999872448]]],
            [
              { "unCurrencySymbol": "05969c8ffafda0e0842dc33613f6d06980a8a5231bdd75e50a353304" },
              [
                [{ "unTokenName": "Pool State" }, 0],
                [
                  {
                    "unTokenName": "\u00000x6e3058d4204fad57e07f14dbbe203dd2a57ed5bf89dc81a9338a252b8d82bf44"
                  },
                  223607
                ]
              ]
            ],
            [
              { "unCurrencySymbol": "28db4965d376271c68b1221f20dfc383471e75f921b4fbde641b5beb" },
              [[{ "unTokenName": "Uniswap" }, 0]]
            ]
          ]
        },
        "tag": "Funds"
      }
    },
    ...
}
```

## Add tokens to pool

Wallet 3 decided to add some tokens to the pool. He would do it by calling `add` endpoint:

```jsx
const body = {
	apAmountA: 400,
	apAmountB: 800,
  apCoinA: { unAssetClass: [SYMBOL, { unTokenName: "A" }] },
  apCoinB: { unAssetClass: [SYMBOL, { unTokenName: "B" }] },
}

const CONTRACT = getContract('Charlie');
await callAction(CONTRACT, 'add', body);
> await printPools(CONTRACT);

{
  "cicCurrentState": {
    "observableState": {
      "Right": {
        "contents": [
          [
            [
              {
                "unAssetClass": [
                  {
                    "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59"
                  },
                  { "unTokenName": "A" }
                ]
              },
              1500
            ],
            [
              {
                "unAssetClass": [
                  {
                    "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59"
                  },
                  { "unTokenName": "B" }
                ]
              },
              2619
            ]
          ],
          [
            [{ "unAssetClass": [{ "unCurrencySymbol": "" }, { "unTokenName": "" }] }, 100000],
            [
              {
                "unAssetClass": [
                  {
                    "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59"
                  },
                  { "unTokenName": "A" }
                ]
              },
              500000
            ]
          ]
        ],
        "tag": "Pools"
      }
    },
    ...
}
```

## Burn tokens from pool and close the pool

We can also close burn tokens from the pool. Let's assume that Wallet 1 decided to remove it's liquidity from the pool. First we need to know how many liquidity tokens does it have:

```jsx
const CONTRACT = getContract('Alice');
> await printFunds(CONTRACT);

{
  "cicCurrentState": {
    "observableState": {
      "Right": {
        "contents": {
          "getValue": [
            [
              { "unCurrencySymbol": "28db4965d376271c68b1221f20dfc383471e75f921b4fbde641b5beb" },
              [[{ "unTokenName": "Uniswap" }, 0]]
            ],
            [
              { "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59" },
              [
                [{ "unTokenName": "A" }, 999000],
                [{ "unTokenName": "B" }, 998000],
                [{ "unTokenName": "C" }, 1000000],
                [{ "unTokenName": "D" }, 1000000]
              ]
            ],
            [{ "unCurrencySymbol": "" }, [[{ "unTokenName": "" }, 99999974956]]],
            [
              { "unCurrencySymbol": "05969c8ffafda0e0842dc33613f6d06980a8a5231bdd75e50a353304" },
              [
                [{ "unTokenName": "Pool State" }, 0],
                [
                  {
                    "unTokenName": "\u00000xcb9f232f60eeced2be7f404b66f85d531aa5a7a518d9d2a21135f73b9d2fa21f"
                  },
                  1415
                ]
              ]
            ]
          ]
        },
        "tag": "Funds"
      }
    },
    ...
}
```

Then we need to call `remove` endpoint to swap liquidity token for other tokens in the pool:

```jsx
const body = {
	rpDiff: 1415,
	rpCoinA: { unAssetClass: [SYMBOL, { unTokenName: "A" }] },
  rpCoinB: { unAssetClass: [SYMBOL, { unTokenName: "B" }] },
}

await callAction(CONTRACT, 'remove', body);

> await printFunds(CONTRACT);

{
  "cicCurrentState": {
    "observableState": {
      "Right": {
        "contents": {
          "getValue": [
            [
              { "unCurrencySymbol": "28db4965d376271c68b1221f20dfc383471e75f921b4fbde641b5beb" },
              [[{ "unTokenName": "Uniswap" }, 0]]
            ],
            [
              { "unCurrencySymbol": "d7875ad78399de9614987c4025820228ab53b607de69e71d78a9cf59" },
              [
                [{ "unTokenName": "A" }, 1000070],
                [{ "unTokenName": "B" }, 999869],
                [{ "unTokenName": "C" }, 1000000],
                [{ "unTokenName": "D" }, 1000000]
              ]
            ],
            [{ "unCurrencySymbol": "" }, [[{ "unTokenName": "" }, 99999959371]]],
            [
              { "unCurrencySymbol": "05969c8ffafda0e0842dc33613f6d06980a8a5231bdd75e50a353304" },
              [
                [{ "unTokenName": "Pool State" }, 0],
                [
                  {
                    "unTokenName": "\u00000xcb9f232f60eeced2be7f404b66f85d531aa5a7a518d9d2a21135f73b9d2fa21f"
                  },
                  0
                ]
              ]
            ]
          ]
        },
        "tag": "Funds"
      }
    },
    ...
}
```

You can check [Uniswap API](./uniswap-api.md) for more information about requests data.