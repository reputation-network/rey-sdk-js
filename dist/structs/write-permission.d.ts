import { Address } from "../types";
import SignatureV2 from "./signature";
export default class WritePermission {
    readonly writer: Address;
    readonly subject: Address;
    readonly signature: SignatureV2;
    constructor(wp: any);
    toABI(): (string | string[])[];
}
