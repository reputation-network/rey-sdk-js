import SignatureV2 from "../structs/signature";
export default class EncryptionKey {
    signature: SignatureV2;
    private keypair?;
    private publicKey?;
    /**
     * Imports an encryption key if given, received from with a third party. Only the public key is imported.
     * @param serializedKey The public key in pkcs8 format
     */
    constructor(serializedKey?: any);
    /**
     * Creates an encryption key to encrypt a request's body.
     */
    createPair(): Promise<void>;
    /**
     * Exports an encryption key to share it with a third party. Only the public key is exported.
     */
    toJSON(): any;
    /**
     * Encrypts a body.
     * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
     */
    encrypt(body: any): any;
    /**
     * Decrypts a body.
     * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
     */
    decrypt(body: any): any;
    toABI(): (string | string[] | undefined)[];
}
