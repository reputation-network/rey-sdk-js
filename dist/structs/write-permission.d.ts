import { Address, RsvSignature } from "../types";
export default class WritePermission {
    readonly writer: Address;
    readonly subject: Address;
    readonly signature: RsvSignature;
    constructor(wp: any);
    toABI(): import("../types").Signature[];
}
