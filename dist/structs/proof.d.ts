import { RsvSignature } from "../types";
import Session from "./session";
import WritePermission from "./write-permission";
export default class Proof {
    readonly writePermission: WritePermission;
    readonly session: Session;
    readonly signature: RsvSignature;
    constructor(proof: any);
    toABI(): import("../types").Signature[][];
}
