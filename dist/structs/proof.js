"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const session_1 = __importDefault(require("./session"));
const write_permission_1 = __importDefault(require("./write-permission"));
class Proof {
    constructor(proof) {
        let idx = 0;
        const writePermission = utils_1.extractIndexOrProperty("proof", proof, idx++, "writePermission");
        this.writePermission = new write_permission_1.default(writePermission);
        const session = utils_1.extractIndexOrProperty("proof", proof, idx++, "session");
        this.session = new session_1.default(session);
        const signature = utils_1.extractIndexOrProperty("proof", proof, idx++, "signature", utils_1.isSignature);
        this.signature = utils_1.normalizeSignature(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.writePermission.toABI(),
            this.session.toABI(),
            this.signature,
        ];
    }
}
exports.default = Proof;
//# sourceMappingURL=proof.js.map