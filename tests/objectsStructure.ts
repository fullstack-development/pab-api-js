import './extendJest';
import {
  FullReport,
  ContractState,
  ContractStateInFullReport,
  ContractStatus,
  ContractSchema,
  EndpointSchema,
  ContractLog,
  ContractHook,
  ContractHookInFullReport,
} from '../src/types';

const сontractError: ContractState['err'] = {
  contents: expect.any(Object),
  tag: expect.any(String),
};

const сontractLog: ContractLog = {
  _logMessageContent: expect.any(String),
  _logLevel: expect.any(String),
};

const contractHook: ContractHook = {
  rqID: expect.any(Number),
  itID: expect.any(Number),
  rqRequest: {
    aeMetadata: null,
    aeDescription: {
      getEndpointDescription: expect.any(String),
    },
  },
};

const contractHookInFullReport: ContractHookInFullReport = {
  rqID: expect.any(Number),
  itID: expect.any(Number),
  rqRequest: {
    contents: expect.any(Object),
    tag: expect.any(String),
  },
};

const сontractStateInFullReport: ContractStateInFullReport = [
  {
    unContractInstanceId: expect.any(String),
  },
  {
    observableState: expect.anyOrNull(Object),
    logs: expect.toEqualInArray(сontractLog),
    hooks: expect.toEqualInArray(contractHookInFullReport),
    err: expect.toEqualOrNull(сontractError),
    lastLogs: expect.toEqualInArray(сontractLog),
  },
];

const contractState: ContractState = {
  observableState: expect.anyOrNull(Object),
  logs: expect.toEqualInArray(сontractLog),
  hooks: expect.toEqualInArray(contractHook),
  err: expect.toEqualOrNull(сontractError),
  lastLogs: expect.toEqualInArray(сontractLog),
};

const endpointSchema: EndpointSchema = {
  argument: {
    tag: expect.any(String),
  },
  endpointDescription: {
    getEndpointDescription: expect.any(String),
  },
};

export const contractSchema: ContractSchema = {
  csrSchemas: expect.toMatchInArray(endpointSchema),
  csrDefinition: { tag: expect.any(String) },
};

export const fullReport: FullReport = {
  contractReport: {
    crAvailableContracts: expect.toEqualInArray(contractSchema),
    crActiveContractStates: expect.toEqualInArray(сontractStateInFullReport),
  },
  chainReport: {
    utxoIndex: {
      getIndex: expect.emptyArray(),
    },
    transactionMap: expect.emptyArray(),
    annotatedBlockchain: expect.emptyArray(),
  },
};

export const contractStatus: ContractStatus = {
  cicCurrentState: contractState,
  cicContract: {
    unContractInstanceId: expect.any(String),
  },
  cicWallet: { getWallet: expect.any(Number) },
  cicDefinition: {
    tag: expect.any(String),
  },
};
