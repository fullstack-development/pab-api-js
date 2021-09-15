import './extendJest';
import { fullReport, contractStatus, contractSchema } from './objectsStructure';
import { Pab } from '../src';

const pab = new Pab('http://localhost:9080/');

const WALLET = '36cb1d44654c33ed6b26cbe2da0848de2ebfdb20010679a06c5f609c474f349b8003380446e9159a34504f9fd19da3e93f215efa30cae9455d441be0eac8db66291a5a5e8c961f9da5fb8cb616ab630a6600f4a44acd520fa701b330849e4446d7d1711ac606ae93a2b3d457dd7f4f36b3af92dd0de82a7caf471fb5ed2b5ea3';
let CONTRACT_NAME;
let CONTRACT_ID;

describe('Check endpoints and result structure', () => {
  beforeAll(async () => {
    try {
      const definitions = await pab.getContractsDefinitions();
      CONTRACT_NAME = definitions[0].csrDefinition.tag;
      CONTRACT_ID = await pab.activateContract(CONTRACT_NAME, WALLET);
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
      await expect(pab.getContractsByWallet(WALLET)).resolves.not.toThrow();
    });
    test('returns an object with the right structure', async () => {
      await expect(pab.getContractsByWallet(WALLET)).resolves.toMatchInArray(contractStatus);
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
      const newContractId = await pab.activateContract(CONTRACT_NAME, WALLET);
      expect(typeof newContractId).toBe('string');
      await expect(pab.stopContract(newContractId)).resolves.not.toThrow();
    });
  });
});
