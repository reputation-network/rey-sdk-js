import { Address, RsvSignature } from "../types";
export default class Session {
    readonly subject: Address;
    readonly verifier: Address;
    readonly fee: string;
    readonly nonce: string;
    readonly signature: RsvSignature;
    constructor(sess: any);
    toABI(): import("../types").Signature[];
}
