"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const proof_1 = __importDefault(require("./proof"));
const request_1 = __importDefault(require("./request"));
const signature_1 = __importDefault(require("./signature"));
class Transaction {
    constructor(tx) {
        let idx = 0;
        const request = utils_1.extractIndexOrProperty("transaction", tx, idx++, "request");
        this.request = new request_1.default(request);
        const proof = utils_1.extractIndexOrProperty("transaction", tx, idx++, "proof");
        this.proof = new proof_1.default(proof);
        const signature = utils_1.extractIndexOrProperty("transaction", tx, idx++, "signature", isSignature);
        this.signature = new signature_1.default(signature);
        Object.freeze(this);
    }
    toABI() {
        return [
            this.request.toABI(),
            this.proof.toABI(),
            this.signature.toABI(),
        ];
    }
}
exports.default = Transaction;
