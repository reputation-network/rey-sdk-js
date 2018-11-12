import ReadPermission from "./read-permission";
import Session from "./session";
import SignatureV2 from "./signature";
export default class Request {
    readonly readPermission: ReadPermission;
    readonly session: Session;
    readonly counter: string;
    readonly value: string;
    readonly signature: SignatureV2;
    constructor(req: any);
    toABI(): (string | (string | string[])[])[];
}
