// Represents a prefixed hex string of L bytes
export type HexString<L extends number> = string;
// Represents an ethereum public address
export type Address = HexString<40>;
// Represents an ethereum signature
export type RsvSignature = [ /*r: */ HexString<64>, /*s: */ HexString<64>, /*v: */ HexString<2>];
export type RpcSignature = HexString<130>
export type Signature = RpcSignature | RsvSignature;

//
export interface SignStrategy {
  (...args: any[]): Promise<Signature>;
}
