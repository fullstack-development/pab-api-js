# Web-socket support

You can also use PAB web-sockets to get the updates on contract instances. PAB provides two types of web-sockets: **combined** and **contract specific**.

To create a web-socket connection you can use the `createSocket` method from `pab-api-js`.

```jsx
  createSocket = (contractId: string = ''): WebSocket 
```

The `contractId` parameter is optional. If you don't provide it then you will create a combined web-socket that uses `ws://*host*/ws` url. Providing a `contractId` the contract specific socket will be created which is equivalent to `ws://*host*/ws/*contract-instance-id*`. 

All created sockets are stored in private variable, you can use `getSocket` method to retrieve a socket by providing a contract instance id. To get the combined socket you can just omit the parameter.

```jsx
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
	"contents": {"Right": {"getWalletId": *wallet-id*}},
	"tag": "Subscribe" // Subscribe/Unsubscribe
}
```

1. Subscribe/Unsubscribe for contract instance updates

```jsx
{
	"contents": {"Left": {"unContractInstanceId": *contract-instance-id*}},
	"tag": "Subscribe" // Subscribe/Unsubscribe
}
```

### Contract specific web-socket

Currently this type of web-socket does not expect any message from the client. You can only use it for getting information about the contract state. All other interactions should be done by calling PAB API methods.

## Uniswap Playground WS

You can also check the Uniswap playground with web-socket support. Simply run from `./examples/uniswap-playground`

```bash
> npm run dev-w
```