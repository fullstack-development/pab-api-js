export type ChainReport = IChainReport;

export interface IChainReport {
  transactionMap: HaskellMap<TxId, Tx>;
  utxoIndex: UtxoIndex;
  annotatedBlockchain: AnnotatedTx[][];
}

export type Tx = ITx;

export interface ITx {
  txInputs: TxIn[];
  txCollateral: TxIn[];
  txOutputs: TxOut[];
  txMint: Value;
  txFee: Value;
  txValidRange: Interval<Slot>;
  txMintScripts: MintingPolicy[];
  txSignatures: HaskellMap<PubKey, Signature>;
  txRedeemers: HaskellMap<RedeemerPtr, Redeemer>;
  txData: HaskellMap<DatumHash, Datum>;
}

export type TxId = ITxId;

export interface ITxId {
  getTxId: string;
}

export type UtxoIndex = IUtxoIndex;

export interface IUtxoIndex {
  getIndex: HaskellMap<TxOutRef, TxOut>;
}

export type AnnotatedTx = IAnnotatedTx;

export interface IAnnotatedTx {
  sequenceId: SequenceId;
  txId: TxId;
  tx: Tx;
  dereferencedInputs: DereferencedInput[];
  balances: HaskellMap<BeneficialOwner, Value>;
  valid: boolean;
}

export type TxIn = ITxIn;

export interface ITxIn {
  txInRef: TxOutRef;
  txInType: TxInType | null;
}

export type TxOut = ITxOut;

export interface ITxOut {
  txOutAddress: Address;
  txOutValue: Value;
  txOutDatumHash: DatumHash | null;
}

export type CurrencySymbol = ICurrencySymbol;

export interface ICurrencySymbol {
  unCurrencySymbol: string;
}

export type Value = IValue;

export interface IValue {
  getValue: AssocMap<CurrencySymbol, AssocMap<TokenName, number>>;
}

export type TokenName = ITokenName;

export interface ITokenName {
  unTokenName: string;
}

export type AssocMap<K, V> = [K, V][];

export type TxOutRef = ITxOutRef;

export interface ITxOutRef {
  txOutRefId: TxId;
  txOutRefIdx: number;
}

export type SequenceId = ISequenceId;

export interface ISequenceId {
  slotIndex: number;
  txIndex: number;
}

export type DereferencedInput = IDereferencedInput | IInputNotFound;

export interface IDereferencedInput {
  tag: 'DereferencedInput';
  originalInput: TxIn;
  refersTo: TxOut;
}

export interface IInputNotFound {
  tag: 'InputNotFound';
  contents: TxKey;
}

export type BeneficialOwner = IOwnedByPubKey | IOwnedByScript;

export interface IOwnedByPubKey {
  tag: 'OwnedByPubKey';
  contents: PubKeyHash;
}

export interface IOwnedByScript {
  tag: 'OwnedByScript';
  contents: ValidatorHash;
}

export type PubKeyHash = IPubKeyHash;

export interface IPubKeyHash {
  getPubKeyHash: string;
}

export type ValidatorHash = IValidatorHash;

export type IValidatorHash = string;

export type HaskellMap<K, V> = Record<string, V>;

export type Interval<T> = IInterval<T>;

export interface IInterval<T> {
  ivFrom: LowerBound<T>;
  ivTo: UpperBound<T>;
}

export type Slot = ISlot;

export interface ISlot {
  getSlot: number;
}

export type LowerBound<T> = ILowerBound<T>;

export type ILowerBound<T> = [Extended<T>, boolean];

export type UpperBound<T> = IUpperBound<T>;

export type IUpperBound<T> = [Extended<T>, boolean];

export type Extended<T> = INegInf<T> | IFinite<T> | IPosInf<T>;

export interface INegInf<T> {
  tag: 'NegInf';
}

export interface IFinite<T> {
  tag: 'Finite';
  contents: T;
}

export interface IPosInf<T> {
  tag: 'PosInf';
}

export type MintingPolicy = IMintingPolicy;

export interface IMintingPolicy {
  getMintingPolicy: unknown;
}

export type PubKey = IPubKey;

export interface IPubKey {
  getPubKey: LedgerBytes;
}

export type LedgerBytes = ILedgerBytes;

export interface ILedgerBytes {
  getLedgerBytes: string;
}

export type Signature = ISignature;

export interface ISignature {
  getSignature: string;
}

export type RedeemerPtr = IRedeemerPtr;

export type IRedeemerPtr = [ScriptTag, number];

export type ScriptTag = 'Spend' | 'Mint' | 'Cert' | 'Reward';

export type Redeemer = IRedeemer;

export interface IRedeemer {
  getRedeemer: BuiltinData;
}

export type BuiltinData = IBuiltinData;

export type IBuiltinData = Data;

export type Data = IConstr | IMap | IList | II | IB;

export interface IConstr {
  tag: 'Constr';
  contents: [number, Data[]];
}

export interface IMap {
  tag: 'Map';
  contents: [Data, Data][];
}

export interface IList {
  tag: 'List';
  contents: Data[];
}

export interface II {
  tag: 'I';
  contents: number;
}

export interface IB {
  tag: 'B';
  contents: string;
}

export type DatumHash = IDatumHash;

export type IDatumHash = string;

export type Datum = IDatum;

export interface IDatum {
  getDatum: BuiltinData;
}

export type TxInType =
  | IConsumeScriptAddress
  | IConsumePublicKeyAddress
  | IConsumeSimpleScriptAddress;

export interface IConsumeScriptAddress {
  tag: 'ConsumeScriptAddress';
  contents: [Validator, Redeemer, Datum];
}

export interface IConsumePublicKeyAddress {
  tag: 'ConsumePublicKeyAddress';
}

export interface IConsumeSimpleScriptAddress {
  tag: 'ConsumeSimpleScriptAddress';
}

export type Validator = IValidator;

export interface IValidator {
  getValidator: unknown;
}

export type Address = IAddress;

export interface IAddress {
  addressCredential: Credential;
  addressStakingCredential: StakingCredential | null;
}

export type TxKey = ITxKey;

export interface ITxKey {
  _txKeyTxId: TxId;
  _txKeyTxOutRefIdx: number;
}

export type Credential = IPubKeyCredential | IScriptCredential;

export interface IPubKeyCredential {
  tag: 'PubKeyCredential';
  contents: PubKeyHash;
}

export interface IScriptCredential {
  tag: 'ScriptCredential';
  contents: ValidatorHash;
}

export type StakingCredential = IStakingHash | IStakingPtr;

export interface IStakingHash {
  tag: 'StakingHash';
  contents: Credential;
}

export interface IStakingPtr {
  tag: 'StakingPtr';
  contents: [number, number, number];
}
