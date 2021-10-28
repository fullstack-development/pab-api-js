import { makeAutoObservable } from 'mobx';
import WebSocket from 'isomorphic-ws';
import { Action, ActionRequestParams, Asset, CurrencySymbol, Log, Wallet } from 'types';
import { cutString, getEndpointRequestBody } from 'utils/helpers';
import { callEndpointForWebSocket as callEndpoint, pab } from 'utils/pab';

const SYMBOL: CurrencySymbol = {};

type LoadingModule = 'actions' | 'assets';
type AssetsType = 'funds' | 'pools';
type FundsByWallet = { [key: string]: Asset[] };

class StoreWithWebSocket {
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

      this.createSockets();
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

  createSockets = () => {
    this.wallets.forEach(({ id: walletId }) => {
      const contractId = this.getContract(walletId);
      const socket = pab.createSocket(contractId);
      this.addSocketHandlers(socket, walletId);
    });
  };

  addSocketHandlers = (socket: WebSocket, walletId: string) => {
    socket.onopen = async () => {
      if (walletId === this.currentWalletId) {
        await this.fetchAssets('funds');
        await this.fetchAssets('pools');
      }
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(String(event.data));
      if (data.tag !== 'NewObservableState') return;
      const { Right, Left } = data.contents;

      if (Right) {
        this.addLog('SUCCESS', `Tag "${Right.tag}", wallet ${cutString(walletId, 3, 3)}`);
        const tag = Right.tag.toLowerCase();

        // define SYMBOL, finish initialization
        if (!SYMBOL.unCurrencySymbol && tag === 'funds') {
          this.defineSYMBOL(Right);
        }

        if (tag === 'funds' || tag === 'pools') {
          this.convertAndSetAssets(tag, Right, walletId);
        } else {
          await this.fetchAssets('funds');
          await this.fetchAssets('pools');
        }
      }
      if (Left) {
        this.addLog('ERROR', Left);
      }
      this.setLoadingAll(false);
    };

    socket.onerror = (error: any) => {
      this.addLog('ERROR', `WebSocket Error\n\n${error.message}`);
    };
  };

  defineSYMBOL = (Right: any) => {
    try {
      const symbol = Right.contents.getValue.find((el: any) =>
        ['A', 'B', 'C', 'D'].includes(el[1][0][0].unTokenName)
      )?.[0].unCurrencySymbol;

      if (!symbol) throw new Error(`SYMBOL: ${symbol}`);

      SYMBOL.unCurrencySymbol = symbol;
      this.addLog('SUCCESS', `Initialization is finished\n\nSYMBOL: ${symbol}`);
    } catch (err: any) {
      console.error(err);
      this.addLog('ERROR', `Initialization error, SYMBOL not defined\n\n${err?.message}`);
    }
  };

  convertAndSetAssets = (type: AssetsType, Right: any, walletId: string) => {
    const assets: Asset[] = [];
    if (type === 'funds') {
      Right.contents.getValue.forEach(([{ unCurrencySymbol }, arr]: any) => {
        arr.forEach((el: any) => {
          assets.push({
            currencySymbol: unCurrencySymbol,
            tokenName: el[0].unTokenName,
            amount: el[1],
          });
        });
      });
      this.fundsByWallet[walletId] = assets;
    }
    if (type === 'pools') {
      Right.contents.forEach((el: any) => {
        el.forEach((el: any) => {
          assets.push({
            currencySymbol: el[0].unAssetClass[0].unCurrencySymbol,
            tokenName: el[0].unAssetClass[1].unTokenName,
            amount: el[1],
          });
        });
      });
      this.pools = assets;
    }
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
    this.setLoading('actions', true);
    const contractId = this.getContract();

    try {
      const body = getEndpointRequestBody(actionName, params, SYMBOL);
      await callEndpoint(contractId, actionName, body);
    } catch (err: any) {
      console.error(err);
      this.addLog('ERROR', `Action request: "${actionName}"\n\n${err?.message}`);
    }
    this.setLoading('actions', false);
  };

  fetchAssets = async (type: 'funds' | 'pools') => {
    this.setLoading('assets', true);
    const contractId = this.getContract();

    try {
      await callEndpoint(contractId, type, []);
    } catch (err: any) {
      console.error(err);
      this.addLog('ERROR', `Assets request: "${type}"\n\n${err?.message}`);
    }
    this.setLoading('assets', false);
  };
}

export { StoreWithWebSocket };
