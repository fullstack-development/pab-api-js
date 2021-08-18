export type FullReport = {
  chainReport: {
    annotatedBlockchain: AnnotatedBlockchain[];
    transactionMap: Transaction[];
  };
  contractReport: {
    crActiveContractStates: CrActiveContractState[];
    crAvailableContracts: CrAvailableContract[];
  };
};

type AnnotatedBlockchain = unknown;

type Transaction = unknown;

type CrActiveContractState = unknown;

type CrAvailableContract = unknown;
