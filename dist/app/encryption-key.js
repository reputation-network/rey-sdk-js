"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_rsa_1 = __importDefault(require("node-rsa"));
const structs_1 = require("../structs");
const utils_1 = require("./utils");
exports.DEFAULT_KEY_SIZE_BITS = 512;
exports.KEY_FORMAT_PUBLIC = "pkcs8-public-pem";
exports.KEY_FORMAT_PRIVATE = "pkcs8-private-pem";
exports.RSA_ENCRYPTION_SCHEME = "pkcs1_oaep";
exports.RSA_SIGNING_SCHEME = "pkcs1-sha256";
const RSA_OPTS = {
    encryptionScheme: exports.RSA_ENCRYPTION_SCHEME,
    signingScheme: exports.RSA_SIGNING_SCHEME,
};
class EncryptionKey {
    static buildUnsigned() {
        const b = exports.DEFAULT_KEY_SIZE_BITS;
        const privateKey = new node_rsa_1.default({ b }).exportKey(exports.KEY_FORMAT_PRIVATE);
        const signature = utils_1.dummySignature();
        return new EncryptionKey({ privateKey, signature });
    }
    constructor(encryptionKey) {
        if (encryptionKey.privateKey) {
            this.keypair = new node_rsa_1.default(encryptionKey.privateKey, exports.KEY_FORMAT_PRIVATE, RSA_OPTS);
            this.privateKey = this.keypair.exportKey(exports.KEY_FORMAT_PRIVATE);
            this.publicKey = this.keypair.exportKey(exports.KEY_FORMAT_PUBLIC);
        }
        else if (encryptionKey.publicKey) {
            this.keypair = new node_rsa_1.default(encryptionKey.publicKey, exports.KEY_FORMAT_PUBLIC, RSA_OPTS);
            // NOTE: We don't use keypair.exportedKey as above because that might interfere
            // with the signature validation process. For example, if the original publicKey
            // contained one or more line feeds at the end, those will get removed by the
            // exportKey call, causing the signature to be invalid.
            this.publicKey = encryptionKey.publicKey;
            this.privateKey = null;
        }
        else {
            throw new Error("no encryption key format provided");
        }
        this.signature = new structs_1.Signature(encryptionKey.signature);
        Object.freeze(this);
    }
    toJSON() {
        return {
            publicKey: this.publicKey,
            signature: this.signature,
        };
    }
    toString() {
        return this.publicKey;
    }
    toABI() {
        return [
            this.publicKey,
            this.signature,
        ];
    }
    /**
     * Encrypts every leaf value of the provided object.
     * A leaf value is anything that is NOT an array nor an object.
     * @param obj The element to encrypt
     */
    encrypt(obj) {
        return utils_1.traverseLeafs(obj, (v) => this.keypair.encrypt(JSON.stringify(v), "base64"));
    }
    /**
     * Decrypts every leaf value of the provided object.
     * A leaf value is anything that is NOT an array nor an object.
     * @param obj the element to decrypt
     * @throws {TypeError} if the current key does not allow decryption
     */
    decrypt(body) {
        if (!this.keypair.isPrivate()) {
            throw new Error("Current key has no private component, can't decrypt");
        }
        return utils_1.traverseLeafs(body, (v) => JSON.parse(this.keypair.decrypt(v, "utf8")));
    }
}
exports.default = EncryptionKey;
//# sourceMappingURL=encryption-key.js.map