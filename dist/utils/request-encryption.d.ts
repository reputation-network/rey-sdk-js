import NodeRSA from "node-rsa";
/**
 * Creates an RSA encryption key to encrypt a request's body
 */
export declare function createKey(): NodeRSA;
/**
 * Exports an RSA encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
export declare function exportKey(key: NodeRSA): string;
/**
 * Imports an RSA encryption key, received from with a third party. Only the public key is imported.
 * @param serializedKey The key in pkcs8 format
 */
export declare function importKey(serializedKey: string): NodeRSA;
/**
 * Encrypts a body using the given RSA key.
 * @param key The RSA key of the recipient that will decrypt the message
 * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
 */
export declare function encryptBody(key: NodeRSA, body: any): any;
/**
 * Decrypts a body using the given RSA key.
 * @param key The RSA key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
export declare function decryptBody(key: NodeRSA, body: any): any;
