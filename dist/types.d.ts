export declare type HexString<L extends number> = string;
export declare type Hash = HexString<32>;
export declare type Address = HexString<40>;
export declare type RsvSignature = [/*r: */ HexString<32>, /*s: */ HexString<32>, /*v: */ HexString<1>];
export declare type RpcSignature = HexString<65>;
export declare type Signature = RpcSignature | RsvSignature;
export declare type SignStrategy = (...args: any[]) => Promise<Signature>;
export interface SignedEntity {
    signature: Signature;
    toABI(): any[];
}
