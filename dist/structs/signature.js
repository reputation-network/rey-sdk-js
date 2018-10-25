"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class SignatureV2 {
    constructor(signature) {
        let idx = 0;
        signature = utils_1.isHexString(signature, 65) ? this.parseRPC(signature) : signature;
        this.r = utils_1.extractIndexOrProperty("signature", signature, idx++, "r", (r) => utils_1.isHexString(r, 32));
        this.s = utils_1.extractIndexOrProperty("signature", signature, idx++, "s", (s) => utils_1.isHexString(s, 32));
        const vTemp = utils_1.extractIndexOrProperty("signature", signature, idx++, "v", (v) => utils_1.isHexString(v, 1) || utils_1.isNumeric(v));
        this.v = utils_1.isHexString(vTemp, 1) ? vTemp : `0x${vTemp.toString(16)}`;
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
        return `0x${[r, s, v].map((p) => p.replace(/^0x/, "")).join("")}`;
    }
    parseRPC(signature) {
        const [, r, s, v] = /^0x(.{64})(.{64})(.{2})$/.exec(signature);
        return [`0x${r}`, `0x${s}`, `0x${v}`];
    }
}
exports.default = SignatureV2;
//# sourceMappingURL=signature.js.map