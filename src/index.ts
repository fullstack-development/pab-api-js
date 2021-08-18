import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { FullReport } from './types';

export class Pab {
  private axios: AxiosInstance;

  constructor(host: string, axiosConfig: AxiosRequestConfig = {}) {
    this.axios = axios.create({ ...axiosConfig, baseURL: host });
  }

  /**
   * Some description for checkPabExists
   */
  checkPabExists: () => Promise<boolean> = () =>
    this.axios
      .get('api/healthcheck')
      .then(() => true)
      .catch(() => false);

  /**
   * Some description for getFullReport
   */
  getFullReport: () => Promise<FullReport> = () =>
    this.axios.get('api/full-report').then((res) => res.data);

  activateContract: (data: any) => Promise<any> = (data) =>
    this.axios
      .post('api/new/contract/activate', data, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => res.data);

  getContractStatus: (contractInstanceId: string) => Promise<any> = (contractInstanceId) =>
    this.axios
      .get(`api/new/contract/instance/${contractInstanceId}/status`)
      .then((res) => res.data);

  getContractSchema: (contractInstanceId: string) => Promise<any> = (contractInstanceId) =>
    this.axios
      .get(`api/new/contract/instance/${contractInstanceId}/schema`)
      .then((res) => res.data);

  callContractEndpoint: (
    contractInstanceId: string,
    endpointName: string,
    data: any
  ) => Promise<any> = (contractInstanceId, endpointName, data) =>
    this.axios
      .post(`api/new/contract/instance/${contractInstanceId}/endpoint/${endpointName}`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => res.data);

  stopContract: (contractInstanceId: string) => Promise<any> = (contractInstanceId) =>
    this.axios.put(`api/new/contract/instance/${contractInstanceId}/stop`).then((res) => res.data);

  getContractsByWallet: (walletId: string) => Promise<any> = (walletId) =>
    this.axios.get(`api/new/contract/instances/wallet/${walletId}`).then((res) => res.data);

  getContracts: () => Promise<any> = () =>
    this.axios.get('api/new/contract/instances').then((res) => res.data);

  getContractsDefinitions: () => Promise<any> = () =>
    this.axios.get('api/new/contract/definitions').then((res) => res.data);
}
