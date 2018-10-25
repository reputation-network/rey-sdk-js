import Proof from "./proof";
import Request from "./request";
import SignatureV2 from "./signature";
export default class Transaction {
    readonly request: Request;
    readonly proof: Proof;
    readonly signature: SignatureV2;
    constructor(tx: any);
    toABI(): (string | (string | string[])[])[][];
}
