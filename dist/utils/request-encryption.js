"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_rsa_1 = __importDefault(require("node-rsa"));
/**
 * Creates an RSA encryption key to encrypt a request's body
 */
function createKey() {
    return new node_rsa_1.default({ b: 512 });
}
exports.createKey = createKey;
/**
 * Exports an RSA encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
function exportKey(key) {
    return key.exportKey("pkcs8-public");
}
exports.exportKey = exportKey;
/**
 * Imports an RSA encryption key, received from with a third party. Only the public key is imported.
 * @param serializedKey The key in pkcs8 format
 */
function importKey(serializedKey) {
    const key = new node_rsa_1.default();
    key.importKey(serializedKey, "pkcs8-public");
    return key;
}
exports.importKey = importKey;
/**
 * Encrypts a body using the given RSA key.
 * @param key The RSA key of the recipient that will decrypt the message
 * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
 */
function encryptBody(key, body) {
    if (Array.isArray(body)) {
        return body.map((i) => encryptBody(key, i));
    }
    else if (typeof body === "object") {
        const obj = {};
        for (const k in body) {
            if (body.hasOwnProperty(k)) {
                obj[k] = encryptBody(key, body[k]);
            }
        }
        return obj;
    }
    return key.encrypt(JSON.stringify(body), "base64");
}
exports.encryptBody = encryptBody;
/**
 * Decrypts a body using the given RSA key.
 * @param key The RSA key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
function decryptBody(key, body) {
    if (Array.isArray(body)) {
        return body.map((i) => decryptBody(key, i));
    }
    else if (typeof body === "object") {
        const obj = {};
        for (const k in body) {
            if (body.hasOwnProperty(k)) {
                obj[k] = decryptBody(key, body[k]);
            }
        }
        return obj;
    }
    return JSON.parse(key.decrypt(body, "utf8"));
}
exports.decryptBody = decryptBody;
//# sourceMappingURL=request-encryption.js.map