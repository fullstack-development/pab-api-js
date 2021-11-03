import { makeDelay } from 'utils/helpers';
import { pab } from 'utils/pab';

const callEndpointForWebSocket = async (
  contractInstanceId: string,
  endpointName: string,
  data: object = {}
): Promise<void> => {
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
};

export { callEndpointForWebSocket };
