export type FullReport = {
  contractReport: {
    crAvailableContracts: ContractSchema[];
    crActiveContractStates: ContractStateInFullReport[];
  };
  chainReport: {
    utxoIndex: {
      getIndex: any[];
    };
    transactionMap: any[];
    annotatedBlockchain: any[];
  };
};

export type ContractSchema = {
  csrSchemas: EndpointSchema[];
  csrDefinition: string;
};

export type EndpointSchema = {
  argument: {
    contents: [string, { tag: string }][];
    tag: string;
  };
  endpointDescription: { getEndpointDescription: string };
};

export type ContractStateInFullReport = [
  {
    unContractInstanceId: string;
  },
  {
    observableState: any[];
    logs: ContractLog[];
    hooks: ContractHookInFullReport[];
    err: {
      contents: string;
      tag: string;
    } | null;
    lastLogs: ContractLog[];
  }
];

export type ContractState = {
  observableState: any[];
  logs: ContractLog[];
  hooks: ContractHook[];
  err: {
    contents: string;
    tag: string;
  } | null;
  lastLogs: ContractLog[];
};

export type ContractLog = {
  _logMessageContent: string;
  _logLevel: 'Info' | any;
};

export type ContractHookInFullReport = {
  rqID: number;
  itID: number;
  rqRequest: {
    contents: {
      aeMetadata: null | any;
      aeDescription: {
        getEndpointDescription: string;
      };
    };
    tag: string;
  };
};

export type ContractHook = {
  rqID: number;
  itID: number;
  rqRequest: {
    aeMetadata: null | any;
    aeDescription: {
      getEndpointDescription: string;
    };
  };
};

export type ContractStatus = {
  cicCurrentState: ContractState;
  cicContract: {
    unContractInstanceId: string;
  };
  cicWallet: { getWallet: number };
  cicDefinition: string;
};
