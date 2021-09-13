import { Pab } from 'pab-api-js';

const pab = new Pab('http://localhost:3000/pab');

export { pab };
export { callEndpoint } from './callEndpoint';
