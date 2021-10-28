import './extendJest';
import { fullReport, contractStatus, contractSchema } from './objectsStructure';
import { Pab } from '../src';

const pab = new Pab('http://localhost:9080/');

let WALLET_ID;
let CONTRACT_NAME;
let CONTRACT_ID;

describe('Check endpoints and result structure', () => {
  beforeAll(async () => {
    try {
      const contracts = await pab.getContracts();
      WALLET_ID = contracts[0].cicWallet.getWalletId;
      const definitions = await pab.getContractsDefinitions();
      CONTRACT_NAME = definitions[0].csrDefinition.tag;
      CONTRACT_ID = await pab.activateContract(CONTRACT_NAME, WALLET_ID);
    } catch (err) {
      const { status = '', statusText = '', config = { url: '' }, data = '' } = err.response;
      console.error(`Initialization error:\n${status} ${statusText} ${config?.url}\n${data}`);
      process.exit();
    }
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
      await expect(pab.getContractStatus(CONTRACT_ID)).resolves.toMatchObject(contractStatus);
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
      await expect(pab.getContractsByWallet(WALLET_ID)).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractsByWallet(WALLET_ID)).resolves.toMatchInArray(contractStatus);
    });
  });

  describe('getContracts', () => {
    test("doesn't throw an exception", async () => {
      await expect(pab.getContracts()).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContracts()).resolves.toMatchInArray(contractStatus);
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
      const newContractId = await pab.activateContract(CONTRACT_NAME, WALLET_ID);
      expect(typeof newContractId).toBe('string');
      await expect(pab.stopContract(newContractId)).resolves.not.toThrow();
    });
  });
});
