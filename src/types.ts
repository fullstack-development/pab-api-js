export type FullReport = {
  contractReport: {
    crAvailableContracts: CrAvailableContract[];
    crActiveContractStates: ContractState[];
  };
  chainReport: {
    utxoIndex: {
      getIndex: unknown[];
    };
    transactionMap: Transaction[];
    annotatedBlockchain: AnnotatedBlockchain[];
  };
};

type CrAvailableContract = unknown;

export type ContractState = [
  {
    unContractInstanceId: string;
  },
  {
    observableState: null | ContractObservableStateType1 | ContractObservableStateType2;
    logs: ContractLog[];
    hooks: ContractHook[];
    err: null | unknown;
    lastLogs: ContractLog[];
  }
];

type ContractObservableStateType1 = {
  oOperator: {
    getPubKeyHash: string;
  };
  oAsset: {
    unAssetClass: [
      {
        unCurrencySymbol: string;
      },
      {
        unTokenName: string; // ? or constants "USDT" | ...
      }
    ];
  };
  oSymbol: {
    unCurrencySymbol: string;
  };
  oFee: number;
};

type ContractObservableStateType2 = {
  unCurrencySymbol: string;
};

type ContractLog = {
  _logMessageContent: string;
  _logLevel: 'Info' | unknown;
};

type ContractHook = {
  rqID: number;
  itID: number;
  rqRequest: {
    contents: {
      aeMetadata: null | unknown;
      aeDescription: {
        getEndpointDescription: string;
      };
    };
    tag: string;
  };
};

type AnnotatedBlockchain = unknown;

type Transaction = unknown;

export type ContractActivationData = {
  caID: { tag: string }; // will be caId: string
  caWallet: { getWallet: number }; // ? will be caWallet: string
};

export type ContractStatus = {
  cicCurrentState: ContractState;
  cicContract: {
    unContractInstanceId: string;
  };
  cicWallet: { getWallet: number }; // ? will be caWallet: string
  cicDefintion: ContractDefinition;
};

export type ContractDefinition = {
  contents: ContractObservableStateType1;
  tag: string;
};

export type ContractSchema = {
  csrSchemas: EndpointSchema[];
  csrDefinition: ContractDefinition;
};

export type EndpointSchema = {
  // ? name of type
  argument: { tag: string };
  endpointDescription: { getEndpointDescription: string };
};
