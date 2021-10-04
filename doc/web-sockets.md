# Web-socket support

You can also use PAB web-sockets to get the updates on contract instances. PAB provides two types of web-sockets: **combined** and **contract specific.**

To create a web-socket connection you must use the `createSocket` method.

```jsx
/**
   * Create WebSocket connection.
   * @param {string} [contractId=''] - Is optional. If contractId is passed, creates WebSocket
   *                                   connection for this contract instance.
   * @return - WebSocket instance.
   */
  createSocket = (contractId: string = ''): WebSocket
```

The `contractId` parameter is optional. If you don't provide it then you will create a combined web-socket that uses `ws://*host*/ws` url. Providing a `contractId` the contract specific socket will be created. All created sockets are stored in private variable, you can use `getSocket` method to retrieve a socket by providing a contract instance id. To get the combined socket you can just omit the parameter.

```jsx
/**
   * Return the WebSocket instance.
   * @param {string} [contractId=''] - Is optional. If contractId is passed, returns the WebSocket
   *                                   instance for this contract instance or undefined.
   * @return - WebSocket instance or undefined.
   */
  getSocket = (contractId: string = ''): WebSocket | undefined
```

## Combined web-sockets

Combined web-sockets provide general specific functionality to work with PAB contracts:

1. Subscribe/Unsubscribe to Wallet specific actions. That allows the receive information on updated funds for the wallet.
2. Subscribe/Unsubscribe to specific contract instance. That allows you to track updates for a contract instances and receive updates for observable state.
3. Receive updates on blockchain extension via slot changes.

## Contract specific web-sockets

As the name suggests, the contract specific web-socket allows to connect to existing contract instance and receive updates.

1. Same for the combined, you can receive updates on observable state changes.
2. Receive updates for changes on active endpoints.
3. Receive message if contract was finished with error or not.

## Web-socket JSON message spec

### Combined web-socket

1. Subscribe/Unsubscribe for wallet changes

```jsx
{
	"contents": {
		"Right": {"getWalletId": *wallet-id*}
	},
	"tag": "Subscribe" // Subscribe/Unsubscribe
}
```

1. Subscribe/Unsubscribe for contract instance updates

```jsx
{
	"contents": {
		"Left": {"unContractInstanceId": *contract-instance-id*}
	},
	"tag": "Subscribe" // Subscribe/Unsubscribe
}
```

### Example json payload messages from PAB

1. Instance update

```jsx
{
  "contents": [
    { "unContractInstanceId": "1609bcad-c1f9-459b-81e7-3fa220c60beb" },
    {
      "contents": {
        "Right": {
          "usCoin": {
            "unAssetClass": [
              {
                "unCurrencySymbol": "85f2f3fcf522c66dce93c8242dabd49258a8c73126b40ccf35fff82e"
              },
              { "unTokenName": "Uniswap" }
            ]
          }
        }
      },
      "tag": "NewObservableState"
    }
  ],
  "tag": "InstanceUpdate"
}
```

```jsx
{
  "contents": [
    { "unContractInstanceId": "1609bcad-c1f9-459b-81e7-3fa220c60beb" },
    { "contents": [], "tag": "NewActiveEndpoints" }
  ],
  "tag": "InstanceUpdate"
}
```

```jsx
{
  "contents": [
    { "unContractInstanceId": "1609bcad-c1f9-459b-81e7-3fa220c60beb" },
    { "contents": null, "tag": "ContractFinished" }
  ],
  "tag": "InstanceUpdate"
}
```

1. Slot change

```jsx
{"contents": {"getSlot": 627}, "tag": "SlotChange"}
```

1. Wallet funds change

```jsx
{
  "contents": [
    {
      "getWalletId": "ce5bf0869d6720212e4dcf3ea6992cf4a9b88c39261fd9d6a635f046a17da49b6125ba6748c542e5821ec9d1e9d2f0564bc7572c1ec0e1a82cce88951dec70639e228ed6586bd2946247d66f88fac7e266a9cf37ab49ef1b9b17befd34a3db085e5af768f7297f0e1138220378a2d13c470da5a79639d8313911adeb0436d91e"
    },
    {
      "getValue": [
        [
          {
            "unCurrencySymbol": "48d0b18b887eb2e4571d686a1eb61cd6e378b1439c8030217fad5b79"
          },
          [
            [{ "unTokenName": "A" }, 1000000],
            [{ "unTokenName": "B" }, 1000000],
            [{ "unTokenName": "C" }, 999900],
            [{ "unTokenName": "D" }, 1000016]
          ]
        ],
        [{ "unCurrencySymbol": "" }, [[{ "unTokenName": "" }, 99999988522]]],
        [
          {
            "unCurrencySymbol": "a11cd0249c8fcdb7ae4f8b247ed98f5710c739f43ca623a9576e23dc"
          },
          [[{ "unTokenName": "Pool State" }, 0]]
        ]
      ]
    }
  ],
  "tag": "WalletFundsChange"
}
```

### Contract specific web-socket

Currently this type of web-socket does not expect any message from the client. You can only use it for getting information about the contract state. All other interactions should be done by calling PAB API methods.

Receive json payload

1. New observable state

```jsx
{
  "contents": {
    "Right": {
      "usCoin": {
        "unAssetClass": [
          {
            "unCurrencySymbol": "85f2f3fcf522c66dce93c8242dabd49258a8c73126b40ccf35fff82e"
          },
          { "unTokenName": "Uniswap" }
        ]
      }
    }
  },
  "tag": "NewObservableState"
}
```

1. New active endpoints

```jsx
{ "contents": [], "tag": "NewActiveEndpoints" }
```

1. Contract finished

```jsx
{ "contents": null, "tag": "ContractFinished" }
```

## Benefits of web socket

There are few key difference using web socket to fetch information on contract instances compare to using REST API:

- With web sockets you can receive updates about changes in contract instances' state in real time;
- You don't need to pull updated by calling API endpoint and then try to filter whether the data you received is updated or not and is related to your use-case. With web sockets it makes state management for your frontend application cleaner and straightforward;
- For each contract instance you can create a separate web socket connection. Or you can use single web-socket connection and subscribe to multiple contracts to receive updates for. The difference would be on architecture solutions for your frontend application and how you want to manage updates.

If you want to learn more about web socket API you can check [MDN Web documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API#interfaces).

## Uniswap Playground WS

You can also check the Uniswap playground with web-socket support. Simply run from `./examples/uniswap-playground`

```jsx
npm run dev-w
```
