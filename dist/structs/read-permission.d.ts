import { Address, Hash } from "../types";
import SignatureV2 from "./signature";
export default class ReadPermission {
    readonly reader: Address;
    readonly source: Address;
    readonly subject: Address;
    readonly manifest: Hash;
    readonly expiration: string;
    readonly signature: SignatureV2;
    constructor(rp: any);
    toABI(): (string | string[])[];
}
