"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Signature {
    constructor(signature) {
        let idx = 0;
        this.r = extractIndexOrProperty("signature", signature, idx++, "r", (r) => utils_1.isHexString(r, 32));
        this.s = extractIndexOrProperty("signature", signature, idx++, "s", (s) => utils_1.isHexString(s, 32));
        const v = extractIndexOrProperty("signature", signature, idx++, "v", (v) => utils_1.isHexString(v, 1) || utils_1.isNumeric(v));
        this.v = utils_1.isHexString(v, 1) ? v : `0x${v.toString(16)}`;
        Object.freeze(this);
    }
    toABI() {
        const { r, s, v } = this;
        return [r, s, v];
    }
    toRSV() {
        const { r, s, v } = this;
        return { r, s, v };
    }
    toRPC() {
        const { r, s, v } = this;
        return `0x${r}${s}${v}`;
    }
}
exports.default = Signature;
//# sourceMappingURL=signature.js.map
