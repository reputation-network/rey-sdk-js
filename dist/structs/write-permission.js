"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class WritePermission {
    constructor(wp) {
        let idx = 0;
        this.writer = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "writer", utils_1.isAddress);
        this.subject = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "subject", utils_1.isAddress);
        const signature = utils_1.extractIndexOrProperty("writePermission", wp, idx++, "signature", utils_1.isSignature);
        this.signature = utils_1.normalizeSignature(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.writer,
            this.subject,
            this.signature,
        ];
    }
}
exports.default = WritePermission;
//# sourceMappingURL=write-permission.js.map