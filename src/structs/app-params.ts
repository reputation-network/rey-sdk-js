import { EncryptionKey } from "../utils";
import ReadPermission from "./read-permission";
import Request from "./request";
import Signature from "./signature";

export default class AppParams {
  public readonly request: Request;
  public readonly extraReadPermissions: ReadPermission[];
  public readonly version: string = "1.0";
  public readonly encryptionKey?: EncryptionKey;

  constructor(appParams: any) {
    if (!appParams.request) {
      throw new TypeError("Missing request on app access");
    }
    const extraReadPermissions = appParams.extraReadPermissions || [];
    if (!Array.isArray(extraReadPermissions)) {
      throw new TypeError("App access extraReadPermissions must be an array");
    }
    this.request = new Request(appParams.request);
    this.extraReadPermissions = extraReadPermissions.map((rp) => new ReadPermission(rp));
    if (appParams.encryptionKey) { // FIXME: Make encryption key mandatory once all clients implement it
      this.encryptionKey = new EncryptionKey(appParams.encryptionKey);
      Object.freeze(this.encryptionKey);
    }
    Object.freeze(this.extraReadPermissions);
    Object.freeze(this);
  }
}
