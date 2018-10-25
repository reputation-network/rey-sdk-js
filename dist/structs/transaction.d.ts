import Proof from "./proof";
import Request from "./request";
import Signature from "./signature";
export default class Transaction {
    readonly request: Request;
    readonly proof: Proof;
    readonly signature: Signature;
    constructor(tx: any);
    toABI(): any[][];
}
