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
const node_rsa_1 = __importDefault(require("node-rsa"));
const _1 = require(".");
const signature_1 = __importDefault(require("../structs/signature"));
class EncryptionKey {
    /**
     * Imports an encryption key if given, received from with a third party. Only the public key is imported.
     * @param serializedKey The public key in pkcs8 format
     */
    constructor(serializedKey) {
        this.signature = new signature_1.default(_1.dummySignature());
        if (!serializedKey) {
            return;
        }
        if (serializedKey.keypair) {
            this.keypair = serializedKey.keypair;
        }
        else if (serializedKey.publicKey) {
            this.keypair = new node_rsa_1.default();
            this.keypair.importKey(serializedKey.publicKey, "pkcs8-public");
        }
        else {
            throw new Error(`Unknown encryption key serialization ${serializedKey}`);
        }
        this.signature = new signature_1.default(serializedKey.signature);
    }
    /**
     * Creates an encryption key to encrypt a request's body.
     */
    createPair() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keypair = new node_rsa_1.default({ b: 512 });
            return Promise.resolve();
        });
    }
    /**
     * Exports an encryption key to share it with a third party. Only the public key is exported.
     */
    toJSON() {
        return { publicKey: this.exportPublicKey(), signature: this.signature };
    }
    /**
     * Encrypts a body.
     * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
     */
    encrypt(body) {
        if (!this.keypair) {
            throw new Error("Key pair was not initialized");
        }
        if (Array.isArray(body)) {
            return body.map((i) => this.encrypt(i));
        }
        else if (typeof body === "object" && body !== null) {
            const obj = {};
            for (const k in body) {
                if (body.hasOwnProperty(k)) {
                    obj[k] = this.encrypt(body[k]);
                }
            }
            return obj;
        }
        return this.keypair.encrypt(JSON.stringify(body), "base64");
    }
    /**
     * Decrypts a body.
     * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
     */
    decrypt(body) {
        if (!this.keypair || !this.keypair.isPrivate()) {
            throw new Error("Private key required to decrypt");
        }
        if (Array.isArray(body)) {
            return body.map((i) => this.decrypt(i));
        }
        else if (typeof body === "object") {
            const obj = {};
            for (const k in body) {
                if (body.hasOwnProperty(k)) {
                    obj[k] = this.decrypt(body[k]);
                }
            }
            return obj;
        }
        return JSON.parse(this.keypair.decrypt(body, "utf8"));
    }
    toABI() {
        return [
            this.exportPublicKey(),
            this.signature.toABI(),
        ];
    }
    exportPublicKey() {
        if (!this.keypair) {
            throw new Error("Key pair was not initialized");
        }
        return this.keypair.exportKey("pkcs8-public");
    }
}
exports.default = EncryptionKey;
//# sourceMappingURL=encryption-key.js.map