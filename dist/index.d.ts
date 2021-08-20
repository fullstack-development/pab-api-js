import { AxiosRequestConfig } from 'axios';
import { FullReport, ContractActivationData, ContractStatus, ContractSchema } from './types';
/** Class representing a PAB (Plutus Application Backend). */
export declare class Pab {
    private axios;
    /**
     * @param {string} host - The host of PAB.
     * @param {Object} [axiosConfig={}] - A custom config for the axios instance.
     */
    constructor(host: string, axiosConfig?: AxiosRequestConfig);
    /**
     * Checks, if the PAB instance exists.
     * @return {Promise<boolean>} - Promise fulfilled by boolean.
     */
    checkPabExists: () => Promise<boolean>;
    /**
     * Get full information about the PAB instance.
     * @return {Promise<Object>} - Promise fulfilled by the full report object.
     */
    getFullReport: () => Promise<FullReport>;
    /**
     * Activate contract.
     * @param {Object} data
     * @param {string} data.caId - Contract id.
     * @param {string} data.caWallet - Wallet id.
     * @return {Promise<string>} - Promise fulfilled by the activated contract instance id.
     */
    activateContract: (data: ContractActivationData) => Promise<string>;
    /**
     * Get the contract instance's status.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<Object>} - Promise fulfilled by the contract instance's status object.
     */
    getContractStatus: (contractInstanceId: string) => Promise<ContractStatus>;
    /**
     * Get the contract instance's schema.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<Object>} - Promise fulfilled by the contract instance's schema object.
     */
    getContractSchema: (contractInstanceId: string) => Promise<ContractSchema>;
    /**
     * Call the contract instance's endpoint.
     * @param {string} contractInstanceId - Contract instance id.
     * @param {string} endpointName - Action to call on this contract instance.
     * @param {Object} data - The current endpoint parameters. Parameters are different for different
     *                        contracts and endpoints.
     * @return {Promise<Object>} - Promise fulfilled by the current endpoint returning object. Objects
     *                             are different for different contracts and endpoints.
     */
    callContractEndpoint: (contractInstanceId: string, endpointName: string, data: any) => Promise<any>;
    /**
     * Stop the contract instance.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<void>} - Promise fulfilled by void.
     */
    stopContract: (contractInstanceId: string) => Promise<void>;
    /**
     * Get all contract instances statuses by the wallet.
     * @param {string} walletId - Wallet instance id.
     * @return {Promise<Array>} - Promise fulfilled by the wallet's contracts statuses array.
     */
    getContractsByWallet: (walletId: string) => Promise<ContractStatus[]>;
    /**
     * Get all contract instances statuses by all wallets.
     * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
     */
    getContracts: () => Promise<ContractStatus[]>;
    /**
     * Get all contracts definitions.
     * @return {Promise<Array>}
     */
    getContractsDefinitions: () => Promise<[]>;
}
