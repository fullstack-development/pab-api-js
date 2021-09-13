import { Action, CurrencySymbol, ActionRequestParams } from 'types';

const getEndpointRequestBody = (
  endpointName: Action,
  params: ActionRequestParams,
  symbol: CurrencySymbol
) => {
  const { token1, token1Amount, token2, token2Amount, tokensNumber } = params;
  switch (endpointName) {
    case 'create':
      return {
        cpAmountA: token1Amount,
        cpAmountB: token2Amount,
        cpCoinA: { unAssetClass: [symbol, { unTokenName: token1 }] },
        cpCoinB: { unAssetClass: [symbol, { unTokenName: token2 }] },
      };
    case 'swap':
      return {
        spAmountA: token1Amount,
        spAmountB: 0,
        spCoinA: { unAssetClass: [symbol, { unTokenName: token1 }] },
        spCoinB: { unAssetClass: [symbol, { unTokenName: token2 }] },
      };
    case 'add':
      return {
        apAmountA: token1Amount,
        apAmountB: token2Amount,
        apCoinA: { unAssetClass: [symbol, { unTokenName: token1 }] },
        apCoinB: { unAssetClass: [symbol, { unTokenName: token2 }] },
      };
    case 'remove':
      return {
        rpDiff: tokensNumber,
        rpCoinA: { unAssetClass: [symbol, { unTokenName: token1 }] },
        rpCoinB: { unAssetClass: [symbol, { unTokenName: token2 }] },
      };
    case 'close':
      return {
        clpCoinA: { unAssetClass: [symbol, { unTokenName: token1 }] },
        clpCoinB: { unAssetClass: [symbol, { unTokenName: token2 }] },
      };
    default:
      throw new Error('Incorrect endpoint name.');
  }
};

const makeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const cutString = (string: string, charsAtBeginning: number = 5, charsAtEnd: number = 5) => {
  const returnFullString = charsAtBeginning + charsAtEnd >= string.length;
  const cut = `${string.slice(0, charsAtBeginning)}...${string.slice(string.length - charsAtEnd, string.length)}`
  return returnFullString ? string : cut;
};

export { getEndpointRequestBody, makeDelay, cutString };
