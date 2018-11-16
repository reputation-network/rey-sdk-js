"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
/**
 * Returns a new SignStrategy that delegates the signature process into
 * a backend REST API call.
 *
 * The request that will reach the API is a POST with a JSON containing
 * the hash to be signed.
 * The response from the endpoint MUST be a JSON object containing the
 * signature of the hash.
 *
 * @throws {TypeError} if opts.endpoint is not a string
 */
function apiSignHashFactory(o) {
    if (!o.endpoint || typeof o.endpoint !== "string") {
        throw new TypeError("opts.endpoint must be provided");
    }
    const opts = Object.assign({
        transformRequest: (request) => request,
        transformResponseBody: (data) => data.signature,
    }, o);
    return (...data) => __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default(opts.transformRequest({
            method: "POST",
            url: opts.endpoint,
            headers: { "content-type": "application/json; charset=utf-8" },
            body: JSON.stringify({ hash: utils_1.reyHash(data) }),
        }));
        const isOK = res.status >= 200 && res.status < 300;
        if (!isOK) {
            const error = res.data.error || res.data.message || res.data;
            throw new Error(`api sign error: ${res.statusText} ${error}`);
        }
        return opts.transformResponseBody(res.data);
    });
}
exports.default = apiSignHashFactory;
//# sourceMappingURL=api.js.map