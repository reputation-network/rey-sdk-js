"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const signature_1 = __importDefault(require("./signature"));
class WritePermission {
    constructor(wp) {
        let idx = 0;
        this.writer = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "writer", utils_1.isAddress);
        this.subject = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "subject", utils_1.isAddress);
        const signature = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "signature");
        this.signature = new signature_1.default(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.writer,
            this.subject,
            this.signature.toABI(),
        ];
    }
}
exports.default = WritePermission;
//# sourceMappingURL=write-permission.js.map