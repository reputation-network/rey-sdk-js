import { ReadPermission, Request } from "../structs";
import EncryptionKey from "./encryption-key";
export default class AppParams {
    readonly request: Request;
    readonly extraReadPermissions: ReadPermission[];
    readonly version: string;
    readonly encryptionKey: EncryptionKey;
    constructor(appParams: any);
}
