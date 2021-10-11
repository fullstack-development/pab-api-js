import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import WebSocket from 'isomorphic-ws';
import { FullReport, ContractStatus, ContractSchema, AnyHaskellADT } from './types';

/** Class representing a PAB (Plutus Application Backend) API. */
export class Pab<
  Status extends AnyHaskellADT,
  StatusToState extends Record<Status['tag'], unknown>,
  EndpointsParams extends Record<string, unknown>
> {
  axios: AxiosInstance;

  private sockets: { [key: string]: WebSocket } = {};

  private socketURL: string;

  /**
   * @param {string} baseURL - The base URL of PAB.
   * @param {Object} [axiosConfig={}] - A custom config for the axios instance.
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
  getFullReport = (): Promise<FullReport<Status, StatusToState[Status['tag']]>> =>
    this.axios.get('api/fullreport').then((res) => res.data);

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
        { caID: { tag: contractName }, caWallet: { getWalletId: walletId } },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => res.data.unContractInstanceId);

  /**
   * Get the contract instance's status.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's status object.
   */
  getContractStatus = <K extends Status['tag']>(
    contractInstanceId: string
  ): Promise<ContractStatus<Status, StatusToState[K]>> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/status`).then((res) => res.data);

  /**
   * Get the contract instance's schema.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's schema object.
   */
  getContractSchema = (contractInstanceId: string): Promise<ContractSchema<Status>> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/schema`).then((res) => res.data);

  /**
   * Call the contract instance's endpoint.
   * @param {string} contractInstanceId - Contract instance id.
   * @param {string} endpointName - Action to call on this contract instance.
   * @param {Object} data - The current endpoint parameters. Parameters are different for different
   *                        contracts and endpoints. Relate to `schema` endpoint to know about this
   *                        endpoint data structure.
   */
  callContractEndpoint = <EndpointName extends string>(
    contractInstanceId: string,
    endpointName: EndpointName,
    data: EndpointsParams[EndpointName] = [] as any
  ): Promise<void> =>
    this.axios.post(`api/contract/instance/${contractInstanceId}/endpoint/${endpointName}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

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
  ): Promise<ContractStatus<Status, StatusToState[Status['tag']]>[]> =>
    this.axios.get(`api/contract/instances/wallet/${walletId}`).then((res) => res.data);

  /**
   * Get all contract instances statuses by all wallets.
   * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
   */
  getContracts = (): Promise<ContractStatus<Status, StatusToState[Status['tag']]>[]> =>
    this.axios.get('api/contract/instances').then((res) => res.data);

  /**
   * Get all contracts definitions.
   * @return {Promise<Array>}
   */
  getContractsDefinitions = (): Promise<ContractSchema<Status>[]> =>
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
  getSocket = (contractId: string = ''): WebSocket | undefined => {
    const key = contractId || 'root';
    return this.sockets[key];
  };

  /**
   * Add handler for event `message` for the WebSocket instance.
   * @param {string} [contractId=''] - Is optional. If contractId is passed, adds handler to the
   *                                   WebSocket instance by this contract instance, else - to the
   *                                   combined WebSocket instance.
   * @param {function} handleMessage - Callback for event `message`. Function with one argument,
   *                                   witch is similar to `observableState` from `getContractStatus`
   *                                   method.
   * @return {function} - Function, that removes the event listener.
   */
  addSocketMessageHandler = <K extends Status['tag']>(
    contractId: string = '',
    handleMessage: (contents: StatusToState[K]) => void
  ): (() => void) => {
    const socket = this.getSocket(contractId);
    const listener = (event: { data: any }) => {
      const contents = JSON.parse(String(event.data)).contents;
      handleMessage(contents);
    };
    socket.addEventListener('message', listener);
    return () => socket.removeEventListener('message', listener);
  };
}

export * from './types';
