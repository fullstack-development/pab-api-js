export declare type ChainReport = IChainReport;
export interface IChainReport {
    transactionMap: HaskellMap<TxId, Tx>;
    utxoIndex: UtxoIndex;
    annotatedBlockchain: AnnotatedTx[][];
}
export declare type Tx = ITx;
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
export declare type TxId = ITxId;
export interface ITxId {
    getTxId: string;
}
export declare type UtxoIndex = IUtxoIndex;
export interface IUtxoIndex {
    getIndex: HaskellMap<TxOutRef, TxOut>;
}
export declare type AnnotatedTx = IAnnotatedTx;
export interface IAnnotatedTx {
    sequenceId: SequenceId;
    txId: TxId;
    tx: Tx;
    dereferencedInputs: DereferencedInput[];
    balances: HaskellMap<BeneficialOwner, Value>;
    valid: boolean;
}
export declare type TxIn = ITxIn;
export interface ITxIn {
    txInRef: TxOutRef;
    txInType: TxInType | null;
}
export declare type TxOut = ITxOut;
export interface ITxOut {
    txOutAddress: Address;
    txOutValue: Value;
    txOutDatumHash: DatumHash | null;
}
export declare type CurrencySymbol = ICurrencySymbol;
export interface ICurrencySymbol {
    unCurrencySymbol: string;
}
export declare type Value = IValue;
export interface IValue {
    getValue: AssocMap<CurrencySymbol, AssocMap<TokenName, number>>;
}
export declare type TokenName = ITokenName;
export interface ITokenName {
    unTokenName: string;
}
export declare type AssocMap<K, V> = [K, V][];
export declare type TxOutRef = ITxOutRef;
export interface ITxOutRef {
    txOutRefId: TxId;
    txOutRefIdx: number;
}
export declare type SequenceId = ISequenceId;
export interface ISequenceId {
    slotIndex: number;
    txIndex: number;
}
export declare type DereferencedInput = IDereferencedInput | IInputNotFound;
export interface IDereferencedInput {
    tag: 'DereferencedInput';
    originalInput: TxIn;
    refersTo: TxOut;
}
export interface IInputNotFound {
    tag: 'InputNotFound';
    contents: TxKey;
}
export declare type BeneficialOwner = IOwnedByPubKey | IOwnedByScript;
export interface IOwnedByPubKey {
    tag: 'OwnedByPubKey';
    contents: PubKeyHash;
}
export interface IOwnedByScript {
    tag: 'OwnedByScript';
    contents: ValidatorHash;
}
export declare type PubKeyHash = IPubKeyHash;
export interface IPubKeyHash {
    getPubKeyHash: string;
}
export declare type ValidatorHash = IValidatorHash;
export declare type IValidatorHash = string;
export declare type HaskellMap<K, V> = Record<string, V>;
export declare type Interval<T> = IInterval<T>;
export interface IInterval<T> {
    ivFrom: LowerBound<T>;
    ivTo: UpperBound<T>;
}
export declare type Slot = ISlot;
export interface ISlot {
    getSlot: number;
}
export declare type LowerBound<T> = ILowerBound<T>;
export declare type ILowerBound<T> = [Extended<T>, boolean];
export declare type UpperBound<T> = IUpperBound<T>;
export declare type IUpperBound<T> = [Extended<T>, boolean];
export declare type Extended<T> = INegInf<T> | IFinite<T> | IPosInf<T>;
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
export declare type MintingPolicy = IMintingPolicy;
export interface IMintingPolicy {
    getMintingPolicy: unknown;
}
export declare type PubKey = IPubKey;
export interface IPubKey {
    getPubKey: LedgerBytes;
}
export declare type LedgerBytes = ILedgerBytes;
export interface ILedgerBytes {
    getLedgerBytes: string;
}
export declare type Signature = ISignature;
export interface ISignature {
    getSignature: string;
}
export declare type RedeemerPtr = IRedeemerPtr;
export declare type IRedeemerPtr = [ScriptTag, number];
export declare type ScriptTag = 'Spend' | 'Mint' | 'Cert' | 'Reward';
export declare type Redeemer = IRedeemer;
export interface IRedeemer {
    getRedeemer: BuiltinData;
}
export declare type BuiltinData = IBuiltinData;
export declare type IBuiltinData = Data;
export declare type Data = IConstr | IMap | IList | II | IB;
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
export declare type DatumHash = IDatumHash;
export declare type IDatumHash = string;
export declare type Datum = IDatum;
export interface IDatum {
    getDatum: BuiltinData;
}
export declare type TxInType = IConsumeScriptAddress | IConsumePublicKeyAddress | IConsumeSimpleScriptAddress;
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
export declare type Validator = IValidator;
export interface IValidator {
    getValidator: unknown;
}
export declare type Address = IAddress;
export interface IAddress {
    addressCredential: Credential;
    addressStakingCredential: StakingCredential | null;
}
export declare type TxKey = ITxKey;
export interface ITxKey {
    _txKeyTxId: TxId;
    _txKeyTxOutRefIdx: number;
}
export declare type Credential = IPubKeyCredential | IScriptCredential;
export interface IPubKeyCredential {
    tag: 'PubKeyCredential';
    contents: PubKeyHash;
}
export interface IScriptCredential {
    tag: 'ScriptCredential';
    contents: ValidatorHash;
}
export declare type StakingCredential = IStakingHash | IStakingPtr;
export interface IStakingHash {
    tag: 'StakingHash';
    contents: Credential;
}
export interface IStakingPtr {
    tag: 'StakingPtr';
    contents: [number, number, number];
}
