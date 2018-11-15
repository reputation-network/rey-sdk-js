"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structs_1 = require("../structs");
const encryption_key_1 = __importDefault(require("./encryption-key"));
class AppParams {
    constructor(appParams) {
        this.version = "1.0";
        if (!appParams.request) {
            throw new TypeError("Missing request on app access");
        }
        const extraReadPermissions = appParams.extraReadPermissions || [];
        if (!Array.isArray(extraReadPermissions)) {
            throw new TypeError("App access extraReadPermissions must be an array");
        }
        this.request = new structs_1.Request(appParams.request);
        this.extraReadPermissions = extraReadPermissions.map((rp) => new structs_1.ReadPermission(rp));
        this.encryptionKey = new encryption_key_1.default(appParams.encryptionKey);
        Object.freeze(this.extraReadPermissions);
        Object.freeze(this);
    }
}
exports.default = AppParams;
//# sourceMappingURL=params.js.map