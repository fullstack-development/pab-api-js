export declare type FullReport = {
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
declare type CrAvailableContract = unknown;
declare type ContractState = [
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
declare type ContractObservableStateType1 = {
    oOperator: {
        getPubKeyHash: string;
    };
    oAsset: {
        unAssetClass: [
            {
                unCurrencySymbol: string;
            },
            {
                unTokenName: string;
            }
        ];
    };
    oSymbol: {
        unCurrencySymbol: string;
    };
    oFee: number;
};
declare type ContractObservableStateType2 = {
    unCurrencySymbol: string;
};
declare type ContractLog = {
    _logMessageContent: string;
    _logLevel: 'Info' | unknown;
};
declare type ContractHook = {
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
declare type AnnotatedBlockchain = unknown;
declare type Transaction = unknown;
export declare type ContractActivationData = {
    caID: {
        tag: string;
    };
    caWallet: {
        getWallet: number;
    };
};
export declare type ContractStatus = {
    cicCurrentState: ContractState;
    cicContract: {
        unContractInstanceId: string;
    };
    cicWallet: {
        getWallet: number;
    };
    cicDefintion: {
        contents: {
            unCurrencySymbol: string;
        };
        tag: string;
    };
};
export declare type ContractSchema = {
    csrSchemas: EndpointSchema[];
    csrDefinition: ContractObservableStateType1;
};
declare type EndpointSchema = {
    argument: {
        tag: string;
    };
    endpointDescription: {
        getEndpointDescription: string;
    };
};
export {};
