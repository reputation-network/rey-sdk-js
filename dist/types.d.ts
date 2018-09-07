export declare type HexString<L extends number> = string;
export declare type Address = HexString<40>;
export declare type RsvSignature = [/*r: */ HexString<64>, /*s: */ HexString<64>, /*v: */ HexString<2>];
export declare type RpcSignature = HexString<130>;
export declare type Signature = RpcSignature | RsvSignature;
export interface SignStrategy {
    (...args: any[]): Promise<Signature>;
}
