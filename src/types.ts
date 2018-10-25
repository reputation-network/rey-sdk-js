import SignatureV2 from "./structs/signature";

// Represents a prefixed hex string of L bytes
export type HexString<L extends number> = string;
// Represents an ethereum hash
export type Hash = HexString<32>;
// Represents an ethereum public address
export type Address = HexString<40>;
// Represents an ethereum signature
export type RsvSignature = [ /*r: */ HexString<32>, /*s: */ HexString<32>, /*v: */ HexString<1>];
export type RpcSignature = HexString<65>;
export type Signature = RpcSignature | RsvSignature | SignatureV2;

//
export type SignStrategy = (...args: any[]) => Promise<Signature>;
export interface SignedEntity {
  signature: Signature;
  toABI(): any[];
}
