// Represents a prefixed hex string of L bytes
export type HexString<L extends number> = string;
// Represents an ethereum hash
export type Hash = HexString<32>;
// Represents an ethereum public address
export type Address = HexString<40>;
// Represents an ethereum signature
export interface AbiSignature { 0: HexString<32>; 1: HexString<32>; 2: HexString<1>; }
export interface RsvSignature { r: HexString<32>; s: HexString<32>; v: HexString<1>; }
export type RpcSignature = HexString<65>;
export type KnownSignatureFormat = AbiSignature | RpcSignature | RsvSignature;

//
export type SignStrategy = (...args: any[]) => Promise<KnownSignatureFormat>;
export interface SignedEntity {
  signature: KnownSignatureFormat;
  toABI(): any[];
}
