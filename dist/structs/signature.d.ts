import { HexString } from "../types";
export default class SignatureV2 {
    readonly r: HexString<32>;
    readonly s: HexString<32>;
    readonly v: HexString<1>;
    constructor(signature: any);
    toABI(): string[];
    toRSV(): {
        r: string;
        s: string;
        v: string;
    };
    toRPC(): string;
    private parseRPC;
}
