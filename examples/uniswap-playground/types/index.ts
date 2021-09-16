export type Token = 'A' | 'B' | 'C' | 'D';

export type Action = 'create' | 'swap' | 'add' | 'remove' | 'close';

export type CurrencySymbol = { unCurrencySymbol?: string };

export type Wallet = {
  id: string;
  contractId: string;
};

export type ActionRequestParams = {
  token1?: Token;
  token1Amount?: number;
  token2?: Token;
  token2Amount?: number;
  tokensNumber?: number;
};

export type Asset = {
  currencySymbol: string;
  tokenName: string;
  amount: number;
};

export type Log = {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  time: Date;
  message: string;
};
