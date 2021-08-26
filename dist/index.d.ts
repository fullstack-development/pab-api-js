import { AxiosRequestConfig } from 'axios';
import { FullReport, ContractStatus, ContractSchema } from './types';
/** Class representing a PAB (Plutus Application Backend) API. */
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
     * @param {string} contractName - Contract name, that you get from calling `fullreport` or
     *                                `definitions` in field `csrDefinition`.
     * @param {number} walletNumber - Wallet number, integer from 1 to 10.
     * @return {Promise<string>} - Promise fulfilled by the activated contract instance id.
     */
    activateContract: (contractName: string, walletNumber: number) => Promise<string>;
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
     *                        contracts and endpoints. Relate to `schema` endpoint to know about this
     *                        endpoint data structure.
     */
    callContractEndpoint: (contractInstanceId: string, endpointName: string, data?: object) => Promise<void>;
    /**
     * Stop the contract instance.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<void>} - Promise fulfilled by void.
     */
    stopContract: (contractInstanceId: string) => Promise<void>;
    /**
     * Get all contract instances statuses by the wallet.
     * @param {number} walletNumber - Wallet number, integer from 1 to 10.
     * @return {Promise<Array>} - Promise fulfilled by the wallet's contracts statuses array.
     */
    getContractsByWallet: (walletNumber: number) => Promise<ContractStatus[]>;
    /**
     * Get all contract instances statuses by all wallets.
     * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
     */
    getContracts: () => Promise<ContractStatus[]>;
    /**
     * Get all contracts definitions.
     * @return {Promise<Array>}
     */
    getContractsDefinitions: () => Promise<ContractSchema[]>;
}
export * from './types';
