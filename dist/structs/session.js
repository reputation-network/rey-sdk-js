"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Session {
    constructor(sess) {
        let idx = 0;
        this.subject = utils_1.extractIndexOrProperty("session", sess, idx++, "subject", utils_1.isAddress);
        this.verifier = utils_1.extractIndexOrProperty("session", sess, idx++, "verifier", utils_1.isAddress);
        this.fee = utils_1.extractIndexOrProperty("session", sess, idx++, "fee", utils_1.isNumeric);
        this.nonce = utils_1.extractIndexOrProperty("session", sess, idx++, "nonce", utils_1.isNumeric);
        const signature = utils_1.extractIndexOrProperty("session", sess, idx++, "signature", utils_1.isSignature);
        this.signature = utils_1.normalizeSignature(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.subject,
            this.verifier,
            this.fee,
            this.nonce,
            this.signature,
        ];
    }
}
exports.default = Session;
//# sourceMappingURL=session.js.map