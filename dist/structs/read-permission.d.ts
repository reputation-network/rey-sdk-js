import { Address, RsvSignature } from "../types";
export default class ReadPermission {
    readonly reader: Address;
    readonly source: Address;
    readonly subject: Address;
    readonly expiration: string;
    readonly signature: RsvSignature;
    constructor(rp: any);
    toABI(): import("../types").Signature[];
}
