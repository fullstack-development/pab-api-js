import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import WebSocket from 'isomorphic-ws';
import { FullReport, ContractStatus, ContractSchema, AnyHaskellADT, SocketResponse } from './types';

export type AnyEndpoint = {
  name: string;
  params: unknown;
  response: unknown;
};

/** Class representing a PAB (Plutus Application Backend) API. */
export class Pab<
  ContractType extends AnyHaskellADT,
  Endpoints extends Record<ContractType['tag'], AnyEndpoint[]>
> {
  axios: AxiosInstance;

  private sockets: { [key: string]: WebSocket } = {};

  private socketURL: string;

  /**
   * @param {string} baseURL - The base URL of PAB.
   * @param {Object} [axiosConfig={}] - A custom config for the axios instance.s
   */
  constructor(baseURL: string, axiosConfig: AxiosRequestConfig = {}) {
    this.axios = axios.create({ ...axiosConfig, baseURL });
  }

  /**
   * Checks, if the PAB instance exists.
   * @return {Promise<boolean>} - Promise fulfilled by boolean.
   */
  checkPabExists = (): Promise<boolean> =>
    this.axios
      .get('api/healthcheck')
      .then(() => true)
      .catch(() => false);

  /**
   * Get full information about the PAB instance.
   * @return {Promise<Object>} - Promise fulfilled by the full report object.
   */
  getFullReport = (): Promise<
    FullReport<ContractType, Endpoints[ContractType['tag']][number]['response']>
  > => this.axios.get('api/fullreport').then((res) => res.data);

  /**
   * Activate contract.
   * @param {string} contractName - Contract name, that you get from calling `fullreport` or
   *                                `definitions` in field `csrDefinition`.
   * @param {string} walletId - Wallet Id.
   * @return {Promise<string>} - Promise fulfilled by the activated contract instance id.
   */
  activateContract = (contractName: string, walletId: string): Promise<string> =>
    this.axios
      .post(
        'api/contract/activate',
        {
          caID: { tag: contractName },
          caWallet: { getWalletId: walletId },
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => res.data.unContractInstanceId);

  /**
   * Get the contract instance's status.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's status object.
   */
  getContractStatus = <K extends ContractType['tag']>(
    contractInstanceId: string
  ): Promise<ContractStatus<ContractType, Endpoints[K][number]['response']>> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/status`).then((res) => res.data);

  /**
   * Get the contract instance's observableState from status.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's state object.
   */
  getContractState = <K extends ContractType['tag']>(
    contractInstanceId: string
  ): Promise<Endpoints[K][number]['response']> =>
    this.getContractStatus<K>(contractInstanceId).then(
      ({ cicCurrentState: { observableState } }) => observableState
    );

  /**
   * Get the contract instance's schema.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's schema object.
   */
  getContractSchema = (contractInstanceId: string): Promise<ContractSchema<ContractType>> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/schema`).then((res) => res.data);

  /**
   * Call the contract instance's endpoint.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Function} - Function, that accepts endpoint parameters.
   */
  callContractEndpoint =
    <K extends ContractType['tag']>(contractInstanceId: string) =>
    /**
     * @param {string} endpointName - Action to call on this contract instance.
     * @param {Object} data - The current endpoint parameters. Parameters are different for different
     *                        contracts and endpoints. Relate to `schema` endpoint to know about this
     *                        endpoint data structure.
     * @return {Promise<void>}
     */
    <EndpointName extends Endpoints[K][number]['name']>(
      endpointName: EndpointName,
      data: Extract<Endpoints[K][number], { name: EndpointName }>['params']
    ): Promise<void> =>
      this.axios.post(
        `api/contract/instance/${contractInstanceId}/endpoint/${endpointName}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

  /**
   * Stop the contract instance.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<void>} - Promise fulfilled by void.
   */
  stopContract = (contractInstanceId: string): Promise<void> =>
    this.axios.put(`api/contract/instance/${contractInstanceId}/stop`);

  /**
   * Get all contract instances statuses by the wallet.
   * @param {string} walletId - Wallet Id.
   * @return {Promise<Array>} - Promise fulfilled by the wallet's contracts statuses array.
   */
  getContractsByWallet = (
    walletId: string
  ): Promise<ContractStatus<ContractType, Endpoints[ContractType['tag']][number]['response']>[]> =>
    this.axios.get(`api/contract/instances/wallet/${walletId}`).then((res) => res.data);

  /**
   * Get all contract instances statuses by all wallets.
   * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
   */
  getContracts = (): Promise<
    ContractStatus<ContractType, Endpoints[ContractType['tag']][number]['response']>[]
  > => this.axios.get('api/contract/instances').then((res) => res.data);

  /**
   * Get all contracts definitions.
   * @return {Promise<Array>}
   */
  getContractsDefinitions = (): Promise<ContractSchema<ContractType>[]> =>
    this.axios.get('api/contract/definitions').then((res) => res.data);

  /**
   * Set base WebSockets URL.
   * @param {string} url - Base URL for PAB WebSockets.
   */
  setSocketURL = (url: string) => {
    this.socketURL = url;
  };

  /**
   * Create WebSocket connection.
   * @param {string} [contractId=''] - Is optional. If contractId is passed, creates WebSocket
   *                                   connection for this contract instance, else - creates
   *                                   combined WebSocket connection.
   * @return - WebSocket instance.
   */
  createSocket = (contractId: string = ''): WebSocket => {
    const key = contractId || 'root';
    if (!this.sockets[key]) this.sockets[key] = new WebSocket(`${this.socketURL}/${contractId}`);
    return this.sockets[key];
  };

  /**
   * Return the WebSocket instance.
   * @param {string} [contractId=''] - Is optional. If contractId is passed, returns the WebSocket
   *                                   instance for this contract instance or undefined, else -
   *                                   returns the combined WebSocket instance.
   * @return - WebSocket instance or undefined.
   */
  getSocket = (contractId: string = ''): WebSocket => {
    const key = contractId || 'root';
    return this.sockets[key];
  };

  /**
   * Add handler for event `message` for the WebSocket instance.
   * @param {string} contractId - The contract instance id to create WebSocket subscription.
   * @return {Function} - Function, that accepts a message handler.
   */
  addSocketMessageHandler =
    <K extends ContractType['tag']>(contractId: string) =>
    /**
     * @param {string} data - Data, received by WebSocket message event.
     * @return {Function} - Function, that removes this WebSocket event handler.
     */
    (
      handleMessage: (
        data: SocketResponse<Endpoints[K][number]['response'], Endpoints[K][number]['name']>
      ) => void
    ): (() => void) => {
      if (contractId === '') {
        throw new Error('Contract id should not be empty');
      }
      const socket = this.getSocket(contractId);
      const listener = (event: { data: any }) => {
        const data = JSON.parse(String(event.data));
        handleMessage(data);
      };
      socket.addEventListener('message', listener);
      return () => socket.removeEventListener('message', listener);
    };
}

/**
 * Helper function, that allows to connect the current contract instance with the correct types.
 * @param {Object} pab - The instance of the Pab class.
 * @return {Object} - Object with methods, related to the current contract instance.
 */
export const withInstanceId =
  <
    ContractType extends AnyHaskellADT,
    Endpoints extends Record<ContractType['tag'], AnyEndpoint[]>
  >(
    pab: Pab<ContractType, Endpoints>
  ) =>
  <K extends ContractType['tag']>(instanceId: string) => ({
    getStatus: () => pab.getContractStatus<K>(instanceId),
    getState: () => pab.getContractState<K>(instanceId),
    getSchema: () => pab.getContractSchema(instanceId),
    callEndpoint: pab.callContractEndpoint<K>(instanceId),
    stop: () => pab.stopContract(instanceId),
    createSocket: () => pab.createSocket(instanceId),
    getSocket: () => pab.getSocket(instanceId),
    subscribe: pab.addSocketMessageHandler<K>(instanceId),
  });

export * from './types';
