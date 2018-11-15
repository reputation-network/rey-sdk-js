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
const safe_buffer_1 = require("safe-buffer");
const utils_1 = require("../utils");
exports.hash = utils_1.reyHash;
const signature_1 = require("../utils/signature");
exports.dummySignature = signature_1.dummySignature;
const struct_validations_1 = require("../utils/struct-validations");
exports.validateSignature = struct_validations_1.validateSignature;
/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
function encodeBase64Url(data) {
    return safe_buffer_1.Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
exports.encodeBase64Url = encodeBase64Url;
function decodeBase64Url(data) {
    return safe_buffer_1.Buffer.from(data, "base64").toString("utf8");
}
exports.decodeBase64Url = decodeBase64Url;
/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
function encodeUnsignedJwt(payload) {
    const headers = { typ: "JWT", alg: "none" };
    const parts = [headers, payload, ""];
    return parts.map((p) => p ? encodeBase64Url(p) : "").join(".");
}
exports.encodeUnsignedJwt = encodeUnsignedJwt;
/**
 * Returns the parsed payload section of the provided JWT
 * @param jwt
 */
function decodeUnsignedJwt(jwt) {
    const [headers, payload, signature] = jwt.split(".");
    return JSON.parse(decodeBase64Url(payload));
}
exports.decodeUnsignedJwt = decodeUnsignedJwt;
/**
 * Extracts the given header from the header hash, parses its value as a
 * base64(json()) encoded value and returs the parsed result.
 * @param headers
 * @param headerName
 * @throws {Error} if no header is found with the given name
 * @throws {Error} if no header value can not be base64 decoded
 * @throws {Error} if no header value can not be json decoded
 */
function decodeHeader(headers, headerName) {
    const base64JsonEncodedHeader = Object.entries(headers).find(([h]) => h.toLowerCase() === headerName.toLocaleLowerCase());
    if (!base64JsonEncodedHeader) {
        throw new Error(`Missing app response header: ${headerName}`);
    }
    const jsonEncodedHeader = (() => {
        try {
            return decodeBase64Url(base64JsonEncodedHeader);
        }
        catch (e) {
            throw new Error(`Could not base64-decode app response header: ${headerName}`);
        }
    })();
    const header = (() => {
        try {
            return JSON.parse(jsonEncodedHeader);
        }
        catch (e) {
            throw new Error(`Could not json-decode app response header: ${headerName}`);
        }
    })();
    return header;
}
exports.decodeHeader = decodeHeader;
/**
 * Given any structure (target), executes the provided iterator for every leaf value
 * and assigns the return value as the new value for the entry.
 * A leaf value is anything that is NOT an array nor an object.
 * @param target
 * @param iterator
 */
function traverseLeafs(target, iterator) {
    if (Array.isArray(target)) {
        return target.map((e) => traverseLeafs(e, iterator));
    }
    else if (target && typeof target === "object") {
        return Object.keys(target).reduce((r, key) => {
            const value = target[key];
            return Object.assign({}, r, traverseLeafs(value, iterator));
        }, {});
    }
    else {
        return iterator(target);
    }
}
exports.traverseLeafs = traverseLeafs;
/**
 * Retrieves the manifest from the provided url, and returns its
 * {@link ManifestEntry} alongside the manifest itself.
 *
 * The manifest entry is NOT VALIDATED, this is responsablilty of
 * the caller of the function.
 */
function getManifestWithEntry(url, http = axios_1.default.create()) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield http.get(url, { responseType: "arraybuffer" });
        const dataBuffer = safe_buffer_1.Buffer.from(res.data);
        const manifest = (() => {
            try {
                return JSON.parse(dataBuffer.toString("utf8"));
            }
            catch (e) {
                throw new Error(`Could not parse app manifest at url ${url}`);
            }
        })();
        return {
            url,
            manifest,
            hash: utils_1.reyHash(dataBuffer),
        };
    });
}
exports.getManifestWithEntry = getManifestWithEntry;
//# sourceMappingURL=utils.js.map