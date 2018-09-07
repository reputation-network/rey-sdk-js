"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class ReadPermission {
    constructor(rp) {
        let idx = 0;
        this.reader = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "reader", utils_1.isAddress);
        this.source = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "source", utils_1.isAddress);
        this.subject = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "subject", utils_1.isAddress);
        this.expiration = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "expiration", utils_1.isNumeric);
        const signature = utils_1.extractIndexOrProperty("readPermission", rp, idx++, "signature", utils_1.isSignature);
        this.signature = utils_1.normalizeSignature(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.reader,
            this.source,
            this.subject,
            this.expiration,
            this.signature,
        ];
    }
}
exports.default = ReadPermission;
//# sourceMappingURL=read-permission.js.map