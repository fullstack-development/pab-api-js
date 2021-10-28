import { makeAutoObservable } from 'mobx';
import { Action, ActionRequestParams, Asset, CurrencySymbol, Log, Wallet } from 'types';
import { getEndpointRequestBody } from 'utils/helpers';
import { callEndpoint, pab } from 'utils/pab';
import { StoreWithWebSocket } from './storeWithWebSocket';

const SYMBOL: CurrencySymbol = {};

type LoadingModule = 'actions' | 'assets';
type AssetsType = 'funds' | 'pools';
type FundsByWallet = { [key: string]: Asset[] };

class Store {
  loadings: { [key in LoadingModule]: boolean } = {
    actions: false,
    assets: true,
  };
  globalError: string | null = null;
  wallets: Wallet[] = [];
  currentWalletId: string = '';
  pools: Asset[] = [];
  logs: Log[] = [];
  fundsByWallet: FundsByWallet = {};

  constructor() {
    makeAutoObservable(this);
  }

  initProject = async () => {
    const pabExists = await pab.checkPabExists();
    if (!pabExists) {
      this.setGlobalError('PAB does not exist');
      this.setLoadingAll(false);
      return;
    }

    this.addRequestsLogging();

    try {
      // define CONTRACTS
      const contracts = await pab.getContracts();
      contracts.forEach((contract, i) => {
        const walletId = contract.cicWallet.getWalletId;
        if (this.wallets.find(wallet => wallet.id === walletId)) return;
        this.addWallet({ id: walletId, contractId: contract.cicContract.unContractInstanceId });
        if (i === 0) this.setCurrentWalletId(walletId);
      });

      // define SYMBOL
      const contractId = this.getContract();
      const state = await callEndpoint(contractId, 'funds', []);
      const symbol = state.observableState.Right.contents.getValue.find((el: any) =>
        el[1].every((el: any) => ['A', 'B', 'C', 'D'].includes(el[0].unTokenName))
      )?.[0].unCurrencySymbol;
      if (!symbol) throw new Error(`SYMBOL: ${symbol}`);
      this.addLog('SUCCESS', `SYMBOL: ${symbol}`);
      SYMBOL.unCurrencySymbol = symbol;

      await this.fetchAssets('funds');
      await this.fetchAssets('pools');
    } catch (err: any) {
      this.setGlobalError('Initialization error');
      console.error(err);
      this.addLog('ERROR', `Initialization error\n\n${err?.message}`);
      this.setLoadingAll(false);
    }
  };

  addRequestsLogging = () => {
    pab.axios.interceptors.response.use(
      (response) => {
        const { url, method, data } = response.config;
        const message = `${String(method).toUpperCase()} ${url}${data ? `\n\ndata: ${data}` : ''}`;
        this.addLog('INFO', message);

        return response;
      },
      (error) => {
        const { config, status, data } = error.response;
        const { url, method } = config;
        const message = `Error ${status} ${method.toUpperCase()} ${url}\n\n${data}`;
        this.addLog('WARNING', message);

        return Promise.reject(error);
      }
    );
  };

  addWallet = (wallet: Wallet) => {
    this.wallets.push(wallet);
  };

  setGlobalError = (errorText: string) => {
    this.globalError = errorText;
  };

  setLoading = (loadingModule: LoadingModule, isLoading: boolean) => {
    this.loadings = { ...this.loadings, [loadingModule]: isLoading };
  };

  setLoadingAll = (isLoading: boolean) => {
    (Object.keys(this.loadings) as LoadingModule[]).forEach(
      (key) => (this.loadings[key] = isLoading)
    );
  };

  setFunds = (walletId: string, funds: Asset[]) => {
    this.fundsByWallet[walletId] = funds;
  };

  setPools = (pools: Asset[]) => {
    this.pools = pools;
  };

  addLog = (type: Log['type'], message: string) => {
    this.logs = [...this.logs, { type, message, time: new Date() }];
  };

  setCurrentWalletId = (walletId: string) => {
    this.currentWalletId = walletId;
  };

  switchWallet = (walletId: string) => {
    this.setCurrentWalletId(walletId);
    this.fetchAssets('funds');
  };

  getContract = (walletId?: string) => {
    return (
      this.wallets.find((wallet) => wallet.id === (walletId || this.currentWalletId))?.contractId ||
      ''
    );
  };

  callAction = async (actionName: Action, params: ActionRequestParams) => {
    this.setLoadingAll(true);
    const contractId = this.getContract();

    try {
      const body = getEndpointRequestBody(actionName, params, SYMBOL);
      await callEndpoint(contractId, actionName, body);
      this.addLog('SUCCESS', `Action "${actionName}"`);
      this.setLoading('actions', false);

      await this.fetchAssets('funds');
      await this.fetchAssets('pools');
    } catch (err: any) {
      console.error(err);
      this.addLog('ERROR', `Action request: "${actionName}"\n\n${err?.message}`);
      this.setLoadingAll(false);
    }
  };

  fetchAssets = async (type: AssetsType) => {
    this.setLoading('assets', true);
    const walletId = this.currentWalletId;
    const contractId = this.getContract(walletId);

    try {
      const state = await callEndpoint(contractId, type, []);
      const assets: Asset[] = [];

      if (type === 'funds') {
        state.observableState.Right.contents.getValue.forEach(
          ([{ unCurrencySymbol }, arr]: any) => {
            arr.forEach((el: any) => {
              assets.push({
                currencySymbol: unCurrencySymbol,
                tokenName: el[0].unTokenName,
                amount: el[1],
              });
            });
          }
        );
        this.setFunds(walletId, assets);
      }

      if (type === 'pools') {
        state.observableState.Right.contents.forEach((el: any) => {
          el.forEach((el: any) => {
            assets.push({
              currencySymbol: el[0].unAssetClass[0].unCurrencySymbol,
              tokenName: el[0].unAssetClass[1].unTokenName,
              amount: el[1],
            });
          });
        });
        this.setPools(assets);
      }

      this.addLog('SUCCESS', `Assets request: "${type}"`);
    } catch (err: any) {
      console.error(err);
      this.addLog('ERROR', `Assets request: "${type}"\n\n${err?.message}`);
    }
    this.setLoading('assets', false);
  };
}

const store = process.env.NEXT_PUBLIC_WITH_WEBSOCKETS ? new StoreWithWebSocket() : new Store();

export { store };
