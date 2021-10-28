import { ContractState } from 'pab-api-js';
import { makeDelay } from 'utils/helpers';
import { pab } from 'utils/pab';

const callEndpoint = async (
  contractInstanceId: string,
  endpointName: string,
  data: object = {}
): Promise<ContractState<any>> => {
  let state: ContractState<any>;
  let isSent = false;
  let isTimeoutError = false;

  const timer = setTimeout(() => {
    isTimeoutError = true;
  }, 5000);

  while (!isSent) {
    try {
      if (isTimeoutError) throw new Error('Timeout error. Failed to call endpoint');

      await pab.callContractEndpoint(contractInstanceId)(endpointName, data);
      isSent = true;
    } catch (err: any) {
      if (err.response?.status >= 500) {
        await makeDelay();
      } else {
        clearTimeout(timer);
        throw err;
      }
    }
  }

  await makeDelay();

  while (true) {
    try {
      if (isTimeoutError) {
        const errorFromState = state!.observableState.Left;
        const errorCommon = 'Timeout error. Endpoint call is success, but failed to get the contract state.';
        throw new Error(errorFromState || errorCommon);
      }
      
      state = (await pab.getContractStatus(contractInstanceId)).cicCurrentState;
      // INFO Left and Right may be incorrect if the previous endpoint was the same
      //      and observableState did not update
      if (state.observableState?.Right?.tag.toLowerCase().includes(endpointName)) {
        return state;
      }
      await makeDelay();
      continue;
    } catch (err: any) {
      if (err.response?.status >= 500) {
        await makeDelay();
      } else {
        clearTimeout(timer);
        throw err;
      }
    }
  }
};

export { callEndpoint };
