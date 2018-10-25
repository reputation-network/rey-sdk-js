import Session from "./session";
import SignatureV2 from "./signature";
import WritePermission from "./write-permission";
export default class Proof {
    readonly writePermission: WritePermission;
    readonly session: Session;
    readonly signature: SignatureV2;
    constructor(proof: any);
    toABI(): (string | string[])[][];
}
