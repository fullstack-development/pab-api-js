import { AxiosInstance, AxiosRequestConfig } from 'axios';
import WebSocket from 'isomorphic-ws';
import { FullReport, ContractStatus, ContractSchema } from './types';
/** Class representing a PAB (Plutus Application Backend) API. */
export declare class Pab {
    axios: AxiosInstance;
    private sockets;
    private socketURL;
    /**
     * @param {string} baseURL - The base URL of PAB.
     * @param {Object} [axiosConfig={}] - A custom config for the axios instance.
     */
    constructor(baseURL: string, axiosConfig?: AxiosRequestConfig);
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
     * @param {string} walletId - Wallet Id.
     * @return {Promise<string>} - Promise fulfilled by the activated contract instance id.
     */
    activateContract: (contractName: string, walletId: string) => Promise<string>;
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
     * @param {string} walletId - Wallet Id.
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
    getContractsDefinitions: () => Promise<ContractSchema[]>;
    /**
     * Set base WebSockets URL.
     * @param {string} url - Base URL for PAB WebSockets.
     */
    setSocketURL: (url: string) => void;
    /**
     * Create WebSocket connection.
     * @param {string} [walletId=''] - Is optional. If walletId is passed, creates WebSocket
     *                                 connection for this wallet.
     * @return - WebSocket instance.
     */
    createSocket: (walletId?: string) => WebSocket;
    /**
     * Return the WebSocket instance.
     * @param {string} [walletId=''] - Is optional. If walletId is passed, returns the WebSocket
     *                                 instance for this wallet or undefined.
     * @return - WebSocket instance or undefined.
     */
    getSocket: (walletId?: string) => WebSocket | undefined;
}
export * from './types';
