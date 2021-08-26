import './extendJest';
import { fullReport, contractStatus, contractSchema } from './objectsStructure';
import { Pab } from '../src';

const pab = new Pab('http://localhost:9080/');

const WALLET_1 = 1;
const WALLET_2 = 2;
const CONTRACT_NAME = 'GameContract';
const ENDPOINT_LOCK = 'lock';
const ENDPOINT_LOCK_DATA = {
  amount: { getValue: [[{ unCurrencySymbol: '' }, [[{ unTokenName: '' }, 90]]]] },
  secretWord: 'eagle',
};
const ENDPOINT_GUESS = 'guess';
const ENDPOINT_GUESS_DATA = { guessWord: 'eagle' };

describe('Check endpoints and result structure', () => {
  let CONTRACT_ID = '';

  beforeAll((done) => {
    pab
      .activateContract(CONTRACT_NAME, WALLET_1)
      .then((contractId) => {
        if (typeof contractId !== 'string') throw Error;
        CONTRACT_ID = contractId;
        done();
      })
      .catch(() => {
        console.error('Error in method "activateContract"');
      });
  });

  describe('checkPabExists', () => {
    test("returns true", async () => {
      await expect(pab.checkPabExists()).resolves.toBeTruthy();
    });
  });

  describe('getFullReport', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getFullReport()).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getFullReport()).resolves.toEqual(fullReport);
    });
  });

  describe('getContractStatus', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContractStatus(CONTRACT_ID)).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractStatus(CONTRACT_ID)).resolves.toEqual(contractStatus);
    });
  });

  describe('getContractSchema', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContractSchema(CONTRACT_ID)).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractSchema(CONTRACT_ID)).resolves.toEqual(contractSchema);
    });
  });

  describe('getContractsByWallet', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContractsByWallet(WALLET_1)).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractsByWallet(WALLET_1)).resolves.toEqualInArray(contractStatus);
    });
  });

  describe('getContracts', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContracts()).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContracts()).resolves.toEqualInArray(contractStatus);
    });
  });

  describe('getContractsDefinitions', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContractsDefinitions()).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractsDefinitions()).resolves.toEqualInArray(contractSchema);
    });
  });

  describe('activateContract and stopContract', () => {
    test("don't throw exceptions", async () => {
      const newContractId = await pab.activateContract(CONTRACT_NAME, WALLET_1);
      await pab.stopContract(newContractId);
    });
  });
});

describe('Test the contract endpoints, play guessing game', () => {
  let CONTRACT_ID_BY_WALLET_1 = '';
  let CONTRACT_ID_BY_WALLET_2 = '';

  describe('Create the contract instances in two wallets, for two players', () => {
    test('create the contract instance in wallet 1', async () => {
      CONTRACT_ID_BY_WALLET_1 = await pab.activateContract(CONTRACT_NAME, WALLET_1);
    });
    test('create the contract instance in wallet 2', async () => {
      CONTRACT_ID_BY_WALLET_2 = await pab.activateContract(CONTRACT_NAME, WALLET_2);
    });
  });

  describe('Check the contract status after step 1', () => {
    test('last log is "Waiting for guess or lock endpoint..."', async () => {
      const logs = (await pab.getContractStatus(CONTRACT_ID_BY_WALLET_1)).cicCurrentState.logs;
      expect(logs[logs.length - 1]._logMessageContent).toBe(
        'Waiting for guess or lock endpoint...'
      );
    });
  });

  describe('Player 1 locks some value in the contract', () => {
    test('lock value "eagle"', async () => {
      await pab.callContractEndpoint(CONTRACT_ID_BY_WALLET_1, ENDPOINT_LOCK, ENDPOINT_LOCK_DATA);
    });
  });

  describe('Check the contract status after step 2', () => {
    test('last log is "Pay Value ... to the script"', async () => {
      const logs = (await pab.getContractStatus(CONTRACT_ID_BY_WALLET_1)).cicCurrentState.logs;
      expect(logs[logs.length - 1]._logMessageContent).toBe(
        `Pay Value (Map [(,Map [(\"\",90)])]) to the script`
      );
    });
  });

  describe('Player 2 makes a guess', () => {
    test('try value "eagle"', async () => {
      await pab.callContractEndpoint(CONTRACT_ID_BY_WALLET_2, ENDPOINT_GUESS, ENDPOINT_GUESS_DATA);
    });
  });

  describe('Check the contract status after step 3', () => {
    test('last log is "Waiting for script to have a UTxO of at least 1 lovelace"', async () => {
      const logs = (await pab.getContractStatus(CONTRACT_ID_BY_WALLET_2)).cicCurrentState.logs;
      expect(logs[logs.length - 1]._logMessageContent).toBe(
        'Waiting for script to have a UTxO of at least 1 lovelace'
      );
    });
  });
});
