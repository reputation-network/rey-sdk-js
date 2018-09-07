import { RsvSignature } from "../types";
import ReadPermission from "./read-permission";
import Session from "./session";
export default class Request {
    readonly readPermission: ReadPermission;
    readonly session: Session;
    readonly counter: string;
    readonly value: string;
    readonly signature: RsvSignature;
    constructor(req: any);
    toABI(): (string | import("../types").Signature[])[];
}
