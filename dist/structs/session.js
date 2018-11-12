"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const signature_1 = __importDefault(require("./signature"));
class Session {
    constructor(sess) {
        let idx = 0;
        this.subject = utils_1.extractIndexOrProperty("session", sess, idx++, "subject", utils_1.isAddress);
        this.verifier = utils_1.extractIndexOrProperty("session", sess, idx++, "verifier", utils_1.isAddress);
        this.fee = utils_1.extractIndexOrProperty("session", sess, idx++, "fee", utils_1.isNumeric);
        this.nonce = utils_1.extractIndexOrProperty("session", sess, idx++, "nonce", utils_1.isNumeric);
        const signature = utils_1.extractIndexOrProperty("session", sess, idx++, "signature");
        this.signature = new signature_1.default(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.subject,
            this.verifier,
            this.fee,
            this.nonce,
            this.signature.toABI(),
        ];
    }
}
exports.default = Session;
//# sourceMappingURL=session.js.map