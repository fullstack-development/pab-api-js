/// <reference types="ws" />
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import WebSocket from 'isomorphic-ws';
import { FullReport, ContractStatus, ContractSchema, AnyHaskellADT, SocketResponse } from './types';
export declare type AnyEndpoint = {
    name: string;
    params: unknown;
    response: unknown;
};
/** Class representing a PAB (Plutus Application Backend) API. */
export declare class Pab<ContractType extends AnyHaskellADT, Endpoints extends Record<ContractType['tag'], AnyEndpoint[]>> {
    axios: AxiosInstance;
    private sockets;
    private socketURL;
    /**
     * @param {string} baseURL - The base URL of PAB.
     * @param {Object} [axiosConfig={}] - A custom config for the axios instance.s
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
    getFullReport: () => Promise<FullReport<ContractType, Endpoints[ContractType['tag']][number]['response']>>;
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
    getContractStatus: <K extends ContractType["tag"]>(contractInstanceId: string) => Promise<ContractStatus<ContractType, Endpoints[K][number]["response"]>>;
    /**
     * Get the contract instance's observableState from status.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<Object>} - Promise fulfilled by the contract instance's state object.
     */
    getContractState: <K extends ContractType["tag"]>(contractInstanceId: string) => Promise<Endpoints[K][number]["response"]>;
    /**
     * Get the contract instance's schema.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Promise<Object>} - Promise fulfilled by the contract instance's schema object.
     */
    getContractSchema: (contractInstanceId: string) => Promise<ContractSchema<ContractType>>;
    /**
     * Call the contract instance's endpoint.
     * @param {string} contractInstanceId - Contract instance id.
     * @return {Function} - Function, that accepts endpoint parameters.
     */
    callContractEndpoint: <K extends ContractType["tag"]>(contractInstanceId: string) => <EndpointName extends Endpoints[K][number]["name"]>(endpointName: EndpointName, data: Extract<Endpoints[K][number], {
        name: EndpointName;
    }>["params"]) => Promise<void>;
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
    getContractsByWallet: (walletId: string) => Promise<ContractStatus<ContractType, Endpoints[ContractType['tag']][number]['response']>[]>;
    /**
     * Get all contract instances statuses by all wallets.
     * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
     */
    getContracts: () => Promise<ContractStatus<ContractType, Endpoints[ContractType['tag']][number]['response']>[]>;
    /**
     * Get all contracts definitions.
     * @return {Promise<Array>}
     */
    getContractsDefinitions: () => Promise<ContractSchema<ContractType>[]>;
    /**
     * Set base WebSockets URL.
     * @param {string} url - Base URL for PAB WebSockets.
     */
    setSocketURL: (url: string) => void;
    /**
     * Create WebSocket connection.
     * @param {string} [contractId=''] - Is optional. If contractId is passed, creates WebSocket
     *                                   connection for this contract instance, else - creates
     *                                   combined WebSocket connection.
     * @return - WebSocket instance.
     */
    createSocket: (contractId?: string) => WebSocket;
    /**
     * Return the WebSocket instance.
     * @param {string} [contractId=''] - Is optional. If contractId is passed, returns the WebSocket
     *                                   instance for this contract instance or undefined, else -
     *                                   returns the combined WebSocket instance.
     * @return - WebSocket instance or undefined.
     */
    getSocket: (contractId?: string) => WebSocket;
    /**
     * Add handler for event `message` for the WebSocket instance.
     * @param {string} contractId - The contract instance id to create WebSocket subscription.
     * @return {Function} - Function, that accepts a message handler.
     */
    addSocketMessageHandler: <K extends ContractType["tag"]>(contractId: string) => (handleMessage: (data: SocketResponse<Endpoints[K][number]["response"], Endpoints[K][number]["name"]>) => void) => (() => void);
}
/**
 * Helper function, that allows to connect the current contract instance with the correct types.
 * @param {Object} pab - The instance of the Pab class.
 * @return {Object} - Object with methods, related to the current contract instance.
 */
export declare const withInstanceId: <ContractType extends AnyHaskellADT, Endpoints extends Record<ContractType["tag"], AnyEndpoint[]>>(pab: Pab<ContractType, Endpoints>) => <K extends ContractType["tag"]>(instanceId: string) => {
    getStatus: () => Promise<ContractStatus<ContractType, Endpoints[K][number]["response"]>>;
    getState: () => Promise<Endpoints[K][number]["response"]>;
    getSchema: () => Promise<ContractSchema<ContractType>>;
    callEndpoint: <EndpointName extends Endpoints[K][number]["name"]>(endpointName: EndpointName, data: Extract<Endpoints[K][number], {
        name: EndpointName;
    }>["params"]) => Promise<void>;
    stop: () => Promise<void>;
    createSocket: () => WebSocket;
    getSocket: () => WebSocket;
    subscribe: (handleMessage: (data: SocketResponse<Endpoints[K][number]["response"], Endpoints[K][number]["name"]>) => void) => (() => void);
};
export * from './types';
