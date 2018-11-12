"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const read_permission_1 = __importDefault(require("./read-permission"));
const session_1 = __importDefault(require("./session"));
const signature_1 = __importDefault(require("./signature"));
class Request {
    constructor(req) {
        let idx = 0;
        const readPermission = utils_1.extractIndexOrProperty("request", req, idx++, "readPermission");
        this.readPermission = new read_permission_1.default(readPermission);
        const session = utils_1.extractIndexOrProperty("request", req, idx++, "session");
        this.session = new session_1.default(session);
        this.counter = utils_1.extractIndexOrProperty("request", req, idx++, "counter", utils_1.isNumeric);
        this.value = utils_1.extractIndexOrProperty("request", req, idx++, "value", utils_1.isNumeric);
        const signature = utils_1.extractIndexOrProperty("request", req, idx++, "signature");
        this.signature = new signature_1.default(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.readPermission.toABI(),
            this.session.toABI(),
            this.counter,
            this.value,
            this.signature.toABI(),
        ];
    }
}
exports.default = Request;
//# sourceMappingURL=request.js.map