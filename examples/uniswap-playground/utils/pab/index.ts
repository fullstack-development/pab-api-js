import { Pab } from 'pab-api-js';

const pab = new Pab('http://localhost:3000/pab');

pab.setSocketURL('ws://localhost:9080/ws');

export { pab };
export { callEndpoint } from './callEndpoint';
export { callEndpointForWebSocket } from './callEndpointForWebSocket';
