import { Pab } from '../src';
import {
  fullReport,
  сontractState,
  contractStatus,
  contractSchema,
  endpointSchema,
} from './objectsStructure';

const pab = new Pab('http://localhost:8080/');

const WALLET_ID = '1';
const CONTRACT_ID = 'f8a85c20-8609-43cc-918c-ef100720790f';
const CONTRACT_ACTIVATION_DATA = { caID: { tag: 'Init' }, caWallet: { getWallet: 1 } };
const ENDPOINT = 'funds';

describe('checkPabExists', () => {
  // TODO now it will always be truthy
  test("doesn't return error", async () => {
    await expect(pab.checkPabExists()).resolves.not.toThrow();
  });
});

describe('getFullReport', () => {
  test("doesn't return error", async () => {
    await expect(pab.getFullReport()).resolves.not.toThrow();
  });

  test('returns object with right structure', async () => {
    const result = await pab.getFullReport();
    expect(result).toMatchObject(fullReport);

    result.contractReport.crActiveContractStates.forEach((el) => {
      expect(el).toMatchObject(сontractState);
    });
  });
});

describe('activateContract', () => {
  test("doesn't return error", async () => {
    await expect(pab.activateContract(CONTRACT_ACTIVATION_DATA)).resolves.not.toThrow();
  });

  test('returns contract id as string', async () => {
    const result = await pab.activateContract(CONTRACT_ACTIVATION_DATA);
    expect(typeof result).toBe('string');
  });
});

describe('getContractStatus', () => {
  test("doesn't return error", async () => {
    await expect(pab.getContractStatus(CONTRACT_ID)).resolves.not.toThrow();
  });

  test('returns object with right structure', async () => {
    const result = await pab.getContractStatus(CONTRACT_ID);
    expect(result).toMatchObject(contractStatus);
  });
});

describe('getContractSchema', () => {
  test("doesn't return error", async () => {
    await expect(pab.getContractSchema(CONTRACT_ID)).resolves.not.toThrow();
  });

  test('returns object with right structure', async () => {
    const result = await pab.getContractSchema(CONTRACT_ID);
    expect(result).toMatchObject(contractSchema);

    result.csrSchemas.forEach((el) => {
      expect(el).toMatchObject(endpointSchema);
    });
  });
});

describe('callContractEndpoint', () => {
  test("doesn't return error", async () => {
    await expect(pab.callContractEndpoint(CONTRACT_ID, ENDPOINT, {})).resolves.not.toThrow();
  });
});

describe('stopContract', () => {
  test("doesn't return error", async () => {
    // needed to activate new contract first
    const newContractId = await pab.activateContract(CONTRACT_ACTIVATION_DATA);
    await expect(pab.stopContract(newContractId)).resolves.not.toThrow();
  });
});

describe('getContractsByWallet', () => {
  test("doesn't return error", async () => {
    await expect(pab.getContractsByWallet(WALLET_ID)).resolves.not.toThrow();
  });
});

describe('getContracts', () => {
  test("doesn't return error", async () => {
    await expect(pab.getContracts()).resolves.not.toThrow();
  });
});

describe('getContractsDefinitions', () => {
  test("doesn't return error", async () => {
    await expect(pab.getContractsDefinitions()).resolves.not.toThrow();
  });
});
