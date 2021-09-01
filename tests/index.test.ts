import './extendJest';
import { fullReport, contractStatus, contractSchema } from './objectsStructure';
import { Pab } from '../src';

const pab = new Pab('http://localhost:9080/');

const WALLET_1 = 1;
const CONTRACT_NAME = 'GameContract';

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
    test('returns true', async () => {
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
      expect(typeof newContractId).toBe('string');
      await expect(pab.stopContract(newContractId)).resolves.not.toThrow();
    });
  });
});

const WALLET_2 = 2;
const WALLET_3 = 3;
const ENDPOINT_LOCK = 'lock';
const ENDPOINT_LOCK_DATA = {
  amount: { getValue: [[{ unCurrencySymbol: '' }, [[{ unTokenName: '' }, 90]]]] },
  secretWord: 'eagle',
};
const ENDPOINT_GUESS = 'guess';
const ENDPOINT_GUESS_DATA_WRONG = { guessWord: 'goose' };
const ENDPOINT_GUESS_DATA_RIGHT = { guessWord: 'eagle' };

let CONTRACT_ID_BY_WALLET_1 = '';
let CONTRACT_ID_BY_WALLET_2 = '';
let CONTRACT_ID_BY_WALLET_3 = '';

const makeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const expectLog = async (contractId: string, logMessage: string) => {
  const logs = (await pab.getContractStatus(contractId)).cicCurrentState.logs;
  expect(logs.some((log) => log._logMessageContent === logMessage)).toBeTruthy();
};

describe('Test the contract endpoints, play guessing game', () => {
  describe('Create the contract instances in three wallets, for three players', () => {
    test('created without exceptions', async () => {
      CONTRACT_ID_BY_WALLET_1 = await pab.activateContract(CONTRACT_NAME, WALLET_1);
      CONTRACT_ID_BY_WALLET_2 = await pab.activateContract(CONTRACT_NAME, WALLET_2);
      CONTRACT_ID_BY_WALLET_3 = await pab.activateContract(CONTRACT_NAME, WALLET_3);
    });
  });

  describe('Player 1 locks some value in the contract', () => {
    test('lock value "eagle", expect correct logs', async () => {
      await pab.callContractEndpoint(CONTRACT_ID_BY_WALLET_1, ENDPOINT_LOCK, ENDPOINT_LOCK_DATA);
      await expectLog(
        CONTRACT_ID_BY_WALLET_1,
        `Pay Value (Map [(,Map [(\"\",90)])]) to the script`
      );
      await makeDelay();
    });
  });

  describe('Player 2 makes a guess', () => {
    test('try wrong value "goose", expect correct logs', async () => {
      await pab.callContractEndpoint(
        CONTRACT_ID_BY_WALLET_2,
        ENDPOINT_GUESS,
        ENDPOINT_GUESS_DATA_WRONG
      );
      await expectLog(
        CONTRACT_ID_BY_WALLET_2,
        'Incorrect secret word, but still submiting the transaction'
      );
    });
  });

  describe('Player 3 makes a guess', () => {
    test('try right value "eagle", expect correct logs', async () => {
      await pab.callContractEndpoint(
        CONTRACT_ID_BY_WALLET_3,
        ENDPOINT_GUESS,
        ENDPOINT_GUESS_DATA_RIGHT
      );
      await expectLog(CONTRACT_ID_BY_WALLET_3, 'Correct secret word! Submitting the transaction');
    });
  });
});
