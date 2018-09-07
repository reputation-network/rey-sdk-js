import ReadPermission from "./read-permission";
import Request from "./request";

export default class AppParams {
  public readonly request: Request;
  public readonly extraReadPermissions: ReadPermission[];
  public readonly version: string = "1.0";

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
    Object.freeze(this.extraReadPermissions);
    Object.freeze(this);
  }
}
