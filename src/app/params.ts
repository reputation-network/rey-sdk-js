import { ReadPermission, Request } from "../structs";
import EncryptionKey from "./encryption-key";

export default class AppParams {
  public readonly request: Request;
  public readonly extraReadPermissions: ReadPermission[];
  public readonly version: string = "1.0";
  public readonly encryptionKey: EncryptionKey;

  constructor(appParams: any) {
    if (!appParams.request) {
      throw new TypeError("Missing request on app params");
    }
    const extraReadPermissions = appParams.extraReadPermissions || [];
    if (!Array.isArray(extraReadPermissions)) {
      throw new TypeError("App params extraReadPermissions must be an array");
    }
    this.request = new Request(appParams.request);
    this.extraReadPermissions = extraReadPermissions.map((rp) => new ReadPermission(rp));

    this.encryptionKey = new EncryptionKey(appParams.encryptionKey);
    Object.freeze(this.extraReadPermissions);
    Object.freeze(this);
  }
}
