import { Signature } from "../structs";
import { KnownSignatureFormat } from "../types";
export declare const DEFAULT_KEY_SIZE_BITS = 512;
export declare const KEY_FORMAT_PUBLIC = "pkcs8-public-pem";
export declare const KEY_FORMAT_PRIVATE = "pkcs8-private-pem";
export declare const RSA_ENCRYPTION_SCHEME = "pkcs1_oaep";
export declare const RSA_SIGNING_SCHEME = "pkcs1-sha256";
export default class EncryptionKey {
    static buildUnsigned(): EncryptionKey;
    readonly publicKey: string;
    readonly signature: Signature;
    protected readonly privateKey: string | null;
    private keypair;
    constructor(encryptionKey: {
        publicKey?: string;
        privateKey?: string;
        signature: KnownSignatureFormat;
    });
    toJSON(): any;
    toString(): string;
    toABI(): (string | Signature)[];
    /**
     * Encrypts every leaf value of the provided object.
     * A leaf value is anything that is NOT an array nor an object.
     * @param obj The element to encrypt
     */
    encrypt(obj: any): any;
    /**
     * Decrypts every leaf value of the provided object.
     * A leaf value is anything that is NOT an array nor an object.
     * @param obj the element to decrypt
     * @throws {TypeError} if the current key does not allow decryption
     */
    decrypt(body: any): any;
}
