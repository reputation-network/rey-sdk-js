"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_buffer_1 = require("safe-buffer");
const structs_1 = require("../structs");
const utils_1 = require("./utils");
class AppResponse {
    constructor(opts) {
        this.rawData = opts.rawData;
        this.data = opts.data;
        this.signature = opts.signature;
        this.proof = opts.proof;
    }
    static fromAxiosRespone(res) {
        const rawData = safe_buffer_1.Buffer.from(res.data);
        return new AppResponse({
            rawData: safe_buffer_1.Buffer.from(res.data),
            data: JSON.parse(rawData.toString()),
            signature: new structs_1.Signature(utils_1.decodeHeader(res.headers, "x-app-signature")),
            proof: new structs_1.Proof(utils_1.decodeHeader(res.headers, "x-app-proof")),
        });
    }
    static fromEncryptedAppResponse(res, encryptionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const decryptedData = yield encryptionKey.decrypt(res.data);
            return new AppResponse(Object.assign({}, res, { data: decryptedData }));
        });
    }
    validateSignature(source) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.validateSignature(utils_1.hash([this.rawData]), this.signature, source);
        });
    }
}
exports.AppResponse = AppResponse;
//# sourceMappingURL=response.js.map