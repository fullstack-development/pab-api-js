export type FullReport<Status, State> = {
  contractReport: {
    crAvailableContracts: ContractSchema<Status>[];
    crActiveContractStates: ContractStateInFullReport<State>[];
  };
  chainReport: {
    utxoIndex: {
      getIndex: any[];
    };
    transactionMap: any[];
    annotatedBlockchain: any[];
  };
};

export type ContractSchema<Status> = {
  csrSchemas: EndpointSchema[];
  csrDefinition: Status;
};

export type EndpointSchema = {
  argument: {
    contents?: [string, { tag: string }][];
    tag: string;
  };
  endpointDescription: { getEndpointDescription: string };
};

export type ContractStateInFullReport<State> = [
  {
    unContractInstanceId: string;
  },
  {
    observableState: State;
    logs: ContractLog[];
    hooks: ContractHookInFullReport[];
    err: {
      contents: any;
      tag: string;
    } | null;
    lastLogs: ContractLog[];
  }
];

export type ContractState<State> = {
  observableState: State;
  logs: ContractLog[];
  hooks: ContractHook[];
  err: {
    contents: any;
    tag: string;
  } | null;
  lastLogs: ContractLog[];
};

export type ContractLog = {
  _logMessageContent: string;
  _logLevel: 'Info' | 'Warning' | any;
};

export type ContractHookInFullReport = {
  rqID: number;
  itID: number;
  rqRequest: {
    contents: any;
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

export type ContractStatus<Status, State> = {
  cicCurrentState: ContractState<State>;
  cicContract: {
    unContractInstanceId: string;
  };
  cicWallet: { getWalletId: string };
  cicDefinition: Status
};
