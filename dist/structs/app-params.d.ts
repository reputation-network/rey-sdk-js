import ReadPermission from "./read-permission";
import Request from "./request";
export default class AppParams {
    readonly request: Request;
    readonly extraReadPermissions: ReadPermission[];
    readonly version: string;
    constructor(appParams: any);
}
