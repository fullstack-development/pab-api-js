import { AxiosRequestConfig } from 'axios';
import { FullReport } from './types';
export declare class Pab {
    private axios;
    constructor(host: string, axiosConfig?: AxiosRequestConfig);
    /**
     * Some description for checkPabExists
     */
    checkPabExists: () => Promise<boolean>;
    /**
     * Some description for getFullReport
     */
    getFullReport: () => Promise<FullReport>;
    activateContract: (data: any) => Promise<any>;
    getContractStatus: (contractInstanceId: string) => Promise<any>;
    getContractSchema: (contractInstanceId: string) => Promise<any>;
    callContractEndpoint: (contractInstanceId: string, endpointName: string, data: any) => Promise<any>;
    stopContract: (contractInstanceId: string) => Promise<any>;
    getContractsByWallet: (walletId: string) => Promise<any>;
    getContracts: () => Promise<any>;
    getContractsDefinitions: () => Promise<any>;
}
