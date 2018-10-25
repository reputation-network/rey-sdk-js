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
const crypto_1 = __importDefault(require("crypto"));
/**
 * Creates an encryption key to encrypt a request's body
 */
function createKey() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            crypto_1.default.generateKeyPair("rsa", { modulusLength: 512,
                publicKeyEncoding: { type: "pkcs1", format: "pem" },
                privateKeyEncoding: { type: "pkcs1", format: "pem" } }, (err, publicKey, privateKey) => {
                if (err)
                    return reject(err);
                return resolve({ publicKey, privateKey });
            });
        });
    });
}
exports.createKey = createKey;
/**
 * Exports an encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
function exportKey(key) {
    return key.publicKey;
}
exports.exportKey = exportKey;
/**
 * Imports an encryption key, received from with a third party. Only the public key is imported.
 * @param publicKey The key in pkcs8 format
 */
function importKey(publicKey) {
    return { publicKey: publicKey };
}
exports.importKey = importKey;
/**
 * Encrypts a body using the given key.
 * @param key The key of the recipient that will decrypt the message
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
    return crypto_1.default.publicEncrypt(key.publicKey, Buffer.from(JSON.stringify(body))).toString("base64");
}
exports.encryptBody = encryptBody;
/**
 * Decrypts a body using the given key.
 * @param key The key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
function decryptBody(key, body) {
    if (!key.privateKey)
        throw new Error("Private key required to decrypt");
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
    return JSON.parse(crypto_1.default.privateDecrypt(key.privateKey, Buffer.from(body, "base64")).toString());
}
exports.decryptBody = decryptBody;
//# sourceMappingURL=request-encryption.js.map