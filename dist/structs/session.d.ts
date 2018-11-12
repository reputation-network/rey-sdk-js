import { Address } from "../types";
import SignatureV2 from "./signature";
export default class Session {
    readonly subject: Address;
    readonly verifier: Address;
    readonly fee: string;
    readonly nonce: string;
    readonly signature: SignatureV2;
    constructor(sess: any);
    toABI(): (string | string[])[];
}
