export declare type FullReport = {
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
export declare type ContractSchema = {
    csrSchemas: EndpointSchema[];
    csrDefinition: {
        tag: string;
    };
};
export declare type EndpointSchema = {
    argument: {
        contents?: [string, {
            tag: string;
        }][];
        tag: string;
    };
    endpointDescription: {
        getEndpointDescription: string;
    };
};
export declare type ContractStateInFullReport = [
    {
        unContractInstanceId: string;
    },
    {
        observableState: any;
        logs: ContractLog[];
        hooks: ContractHookInFullReport[];
        err: {
            contents: any;
            tag: string;
        } | null;
        lastLogs: ContractLog[];
    }
];
export declare type ContractState = {
    observableState: any;
    logs: ContractLog[];
    hooks: ContractHook[];
    err: {
        contents: any;
        tag: string;
    } | null;
    lastLogs: ContractLog[];
};
export declare type ContractLog = {
    _logMessageContent: string;
    _logLevel: 'Info' | 'Warning' | any;
};
export declare type ContractHookInFullReport = {
    rqID: number;
    itID: number;
    rqRequest: {
        contents: any;
        tag: string;
    };
};
export declare type ContractHook = {
    rqID: number;
    itID: number;
    rqRequest: {
        aeMetadata: null | any;
        aeDescription: {
            getEndpointDescription: string;
        };
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
    cicDefinition: {
        contents?: any;
        tag: string;
    };
};
