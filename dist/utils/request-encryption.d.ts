import { Key } from "crypto";
export { Key };
/**
 * Creates an encryption key to encrypt a request's body
 */
export declare function createKey(): Promise<Key>;
/**
 * Exports an encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
export declare function exportKey(key: Key): string;
/**
 * Imports an encryption key, received from with a third party. Only the public key is imported.
 * @param publicKey The key in pkcs8 format
 */
export declare function importKey(publicKey: string): Key;
/**
 * Encrypts a body using the given key.
 * @param key The key of the recipient that will decrypt the message
 * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
 */
export declare function encryptBody(key: Key, body: any): any;
/**
 * Decrypts a body using the given key.
 * @param key The key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
export declare function decryptBody(key: Key, body: any): any;
