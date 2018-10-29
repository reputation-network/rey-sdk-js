"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const read_permission_1 = __importDefault(require("./read-permission"));
const request_1 = __importDefault(require("./request"));
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
        this.request = new request_1.default(appParams.request);
        this.extraReadPermissions = extraReadPermissions.map((rp) => new read_permission_1.default(rp));
        if (appParams.encryptionKey) { // FIXME: Make encryption key mandatory once all clients implement it
            this.encryptionKey = new utils_1.EncryptionKey(appParams.encryptionKey);
            Object.freeze(this.encryptionKey);
        }
        Object.freeze(this.extraReadPermissions);
        Object.freeze(this);
    }
}
exports.default = AppParams;
//# sourceMappingURL=app-params.js.map