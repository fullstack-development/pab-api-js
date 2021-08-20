import {
  FullReport,
  ContractState,
  ContractDefinition,
  ContractStatus,
  ContractSchema,
  EndpointSchema,
} from '../src/types';

export const fullReport: FullReport = {
  contractReport: {
    crAvailableContracts: expect.any(Array),
    crActiveContractStates: expect.any(Array),
  },
  chainReport: {
    utxoIndex: {
      getIndex: expect.any(Array),
    },
    transactionMap: expect.any(Array),
    annotatedBlockchain: expect.any(Array),
  },
};

export const сontractState: ContractState = [
  {
    unContractInstanceId: expect.any(String),
  },
  {
    observableState: expect.any(Object),
    logs: expect.any(Array),
    hooks: expect.any(Array),
    err: null, // null or string
    lastLogs: expect.any(Array),
  },
];

const contractDefinition: ContractDefinition = {
  contents: {
    oOperator: {
      getPubKeyHash: expect.any(String),
    },
    oAsset: {
      unAssetClass: [
        {
          unCurrencySymbol: expect.any(String),
        },
        {
          unTokenName: expect.any(String),
        },
      ],
    },
    oSymbol: {
      unCurrencySymbol: expect.any(String),
    },
    oFee: expect.any(Number),
  },
  tag: expect.any(String),
};

export const contractStatus: ContractStatus = {
  cicCurrentState: expect.any(Object),
  cicContract: {
    unContractInstanceId: expect.any(String),
  },
  cicWallet: { getWallet: expect.any(Number) },
  cicDefintion: contractDefinition,
};

export const contractSchema: ContractSchema = {
  csrSchemas: expect.any(Array),
  csrDefinition: contractDefinition,
};

export const endpointSchema: EndpointSchema = {
  argument: {
    tag: expect.any(String),
  },
  endpointDescription: {
    getEndpointDescription: expect.any(String),
  },
};
