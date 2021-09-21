# Uniswap API

### pools and funds

**Usage**: return list of pools or funds.

**Params:** 

```jsx
[]
```

### create

**Usage**: creates a liquidity pool for two tokens and receive liquidity tokens.
**Params***: 

```jsx
{
	cpAmountA: amountA,
	cpAmountB: amountB,
	cpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
	cpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
}
```

### swap

**Usage**: swaps some number of one type tokens to some number of another.
**Params***: 

```jsx
{
	spAmountA: amountA,
	spAmountB: 0,
	spCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
	spCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
}
```

### add

**Usage**: adds liquidity to the existing pool and receives liquidity tokens.
**Params***: 

```jsx
{
	apAmountA: amountA,
	apAmountB: amountB,
	apCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
	apCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
}
```

### remove

**Usage**: burns some number of liquidity tokens.
**Params***: 

```jsx
{
	rpDiff: tokens,
	rpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
	rpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
}
```

### close

**Usage**: closes liquidity pool. This can only happen when the last remaining liquidity tokens are burnt.
**Params***: 

```jsx
{
	clpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
	clpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
}
```

---

* where:
amountA - amount of the first token,
amountB - amount of the second,
tokenA - name of the first token,
tokenB - name of the second,
symbol - currency symbol for tokens,
tokens - number of tokens.
