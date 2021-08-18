export declare type FullReport = {
    chainReport: {
        annotatedBlockchain: AnnotatedBlockchain[];
        transactionMap: Transaction[];
    };
    contractReport: {
        crActiveContractStates: CrActiveContractState[];
        crAvailableContracts: CrAvailableContract[];
    };
};
declare type AnnotatedBlockchain = unknown;
declare type Transaction = unknown;
declare type CrActiveContractState = unknown;
declare type CrAvailableContract = unknown;
export {};
