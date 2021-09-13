const { getBody, makeDelay, printTitle, printBlock, printEndpoint } = require('./helpers');
const { Pab } = require('../../dist');

const pab = new Pab('http://localhost:9080/');

const SYMBOL = {};
const CONTRACTS_BY_WALLETS = {};

const initConsts = async () => {
  const contracts = await pab.getContracts();
  contracts.forEach((contract) => {
    const wallet = contract.cicWallet.getWallet;
    CONTRACTS_BY_WALLETS[wallet] = contract.cicContract.unContractInstanceId;
  });

  // define SYMBOL
  await pab.callContractEndpoint(CONTRACTS_BY_WALLETS[1], 'funds', []);
  const status = await pab.getContractStatus(CONTRACTS_BY_WALLETS[1]);
  SYMBOL.unCurrencySymbol =
    status.cicCurrentState.observableState.Right.contents.getValue[1][0].unCurrencySymbol;
};

const getStatus = async (contractId, endpointName) => {
  await makeDelay(2000);
  let status;

  while (status?.cicCurrentState?.observableState?.Right?.tag?.toLowerCase() !== endpointName) {
    await pab.callContractEndpoint(contractId, endpointName, []);
    await makeDelay(1000);
    status = await pab.getContractStatus(contractId);
  }
  return status;
};

const printFunds = async (contractId) => {
  const status = await getStatus(contractId, 'funds');
  const table = [];

  status.cicCurrentState.observableState?.Right?.contents?.getValue.forEach(
    ([{ unCurrencySymbol }, arr]) => {
      arr.forEach((el) => {
        table.push({
          currencySymbol: unCurrencySymbol,
          tokenName: el[0].unTokenName,
          amount: el[1],
        });
      });
    }
  );
  if (table.length) console.table(table);
  else console.log('Result: no funds');
};

const printPools = async (contractId) => {
  const status = await getStatus(contractId, 'pools');
  const table = [];

  status.cicCurrentState.observableState?.Right?.contents?.[0]?.forEach((el) => {
    table.push({
      currencySymbol: el[0].unAssetClass[0].unCurrencySymbol,
      tokenName: el[0].unAssetClass[1].unTokenName,
      amount: el[1],
    });
  });
  if (table.length) console.table(table);
  else console.log('Result: no pools');
};

const callEndpoint = async (contractId, endpointName, args) => {
  const body = getBody(endpointName, args, SYMBOL);
  printEndpoint(endpointName, body);
  await pab.callContractEndpoint(contractId, endpointName, body);
};

(async () => {
  await printTitle('UNISWAP EXAMPLE');

  await printBlock('Define consts', async () => {
    await initConsts();

    console.log('SYMBOL: ', SYMBOL);
    console.log('Contract instances by wallets:');
    Object.keys(CONTRACTS_BY_WALLETS).forEach((key) => {
      console.log(`${key}: ${CONTRACTS_BY_WALLETS[key]}`);
    });
    console.log(`
    wallet 1 belongs to Alice
    wallet 2 belongs to Bob
    wallet 3 belongs to Charlie`);
  });

  await printBlock('Check funds and pools of any wallet', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[3];

    await printFunds(CONTRACT);
    console.log('We see that we have A, B, C, D with 1 million each and 100,000 Ada.');

    console.log('We can also look for pools, but right now, there shouldn’t be any, and indeed none are listed.');
    await printPools(CONTRACT);
  });

  await printBlock('Alice', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[1];

    console.log('Alice setting up a liquidity pool for 1000 tokens A and 2000 B tokens.');
    await callEndpoint(CONTRACT, 'create', { amountA: 1000, tokenA: 'A', amountB: 2000, tokenB: 'B' });

    console.log('Query for pools.');
    await printPools(CONTRACT);
    console.log('We see that it has A and B and with the correct amounts, 1000 and 2000 respectively.');
  });

  await printBlock('Bob', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[2];

    console.log('Bob swaps 100A for Bs.');
    await callEndpoint(CONTRACT, 'swap', { amountA: 100, tokenA: 'A', tokenB: 'B' });

    console.log('Let’s check how many funds Bob now has. As expected, he has 100 fewer As and 181 as many Bs.');
    await printFunds(CONTRACT);
  });

  await printBlock('Charlie', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[3];

    console.log('Charlie adds liquidity.');
    await callEndpoint(CONTRACT, 'add', { amountA: 400, tokenA: 'A', amountB: 800, tokenB: 'B' });

    console.log('Check the pools.');
    await printPools(CONTRACT);
    console.log('It’s 1500 and 2619. We had 1000 at the beginning, then 100 where added by Bob and now 400 by Charlie.');
  });

  await printBlock('Alice', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[1];

    console.log('Alice wants to remove her liquidity. So let’s first query her funds.');
    await printFunds(CONTRACT);
    console.log('So she has less A and Bs now because she provided them as liquidity for the pool, but she has 1415 of the liquidity token.');

    console.log('Alice burns liquidity tokens and get tokens in exchange.');
    await callEndpoint(CONTRACT, 'remove', { tokens: 1415, tokenA: 'A', tokenB: 'B' });

    console.log('And let’s query her funds again.');
    await printFunds(CONTRACT);
    console.log('So now she doesn’t have liquidity token anymore, but she got As and Bs back. So she received 1869 Bs and 1070 As.');
  });

  await printBlock('Charlie', async () => {
    const CONTRACT = CONTRACTS_BY_WALLETS[3];

    console.log('First check pools.');
    await printPools(CONTRACT);

    console.log('Charlie closes the pool.');
    await callEndpoint(CONTRACT, 'close', { tokenA: 'A', tokenB: 'B' });

    console.log('And if now we look for pools, then again, we don’t get any. ');
    await printPools(CONTRACT);
  });

  await printTitle('THE END');
})().then(process.exit);
