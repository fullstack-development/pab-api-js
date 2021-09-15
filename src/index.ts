import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { FullReport, ContractStatus, ContractSchema } from './types';

/** Class representing a PAB (Plutus Application Backend) API. */
export class Pab {
  axios: AxiosInstance;

  /**
   * @param {string} host - The host of PAB.
   * @param {Object} [axiosConfig={}] - A custom config for the axios instance.
   */
  constructor(host: string, axiosConfig: AxiosRequestConfig = {}) {
    this.axios = axios.create({ ...axiosConfig, baseURL: host });
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
  getFullReport = (): Promise<FullReport> =>
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
  getContractStatus = (contractInstanceId: string): Promise<ContractStatus> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/status`).then((res) => res.data);

  /**
   * Get the contract instance's schema.
   * @param {string} contractInstanceId - Contract instance id.
   * @return {Promise<Object>} - Promise fulfilled by the contract instance's schema object.
   */
  getContractSchema = (contractInstanceId: string): Promise<ContractSchema> =>
    this.axios.get(`api/contract/instance/${contractInstanceId}/schema`).then((res) => res.data);

  /**
   * Call the contract instance's endpoint.
   * @param {string} contractInstanceId - Contract instance id.
   * @param {string} endpointName - Action to call on this contract instance.
   * @param {Object} data - The current endpoint parameters. Parameters are different for different
   *                        contracts and endpoints. Relate to `schema` endpoint to know about this
   *                        endpoint data structure.
   */
  callContractEndpoint = (
    contractInstanceId: string,
    endpointName: string,
    data: object = {}
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
  getContractsByWallet = (walletId: string): Promise<ContractStatus[]> =>
    this.axios.get(`api/contract/instances/wallet/${walletId}`).then((res) => res.data);

  /**
   * Get all contract instances statuses by all wallets.
   * @return {Promise<Array>} - Promise fulfilled by all wallets contracts statuses array.
   */
  getContracts = (): Promise<ContractStatus[]> =>
    this.axios.get('api/contract/instances').then((res) => res.data);

  /**
   * Get all contracts definitions.
   * @return {Promise<Array>}
   */
  getContractsDefinitions = (): Promise<ContractSchema[]> =>
    this.axios.get('api/contract/definitions').then((res) => res.data);
}

export * from './types';
