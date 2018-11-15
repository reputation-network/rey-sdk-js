"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const signature_1 = __importDefault(require("./signature"));
class ReadPermission {
    constructor(rp) {
        let idx = 0;
        this.reader = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "reader", utils_1.isAddress);
        this.source = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "source", utils_1.isAddress);
        this.subject = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "subject", utils_1.isAddress);
        this.manifest = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "manifest", utils_1.isHash);
        const expiration = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "expiration", utils_1.isNumeric);
        this.expiration = `${expiration}`;
        const signature = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "signature");
        this.signature = new signature_1.default(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.reader,
            this.source,
            this.subject,
            this.manifest,
            this.expiration,
            this.signature.toABI(),
        ];
    }
}
exports.default = ReadPermission;
//# sourceMappingURL=read-permission.js.map