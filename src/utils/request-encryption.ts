import NodeRSA from "node-rsa";

type Key = NodeRSA;
export { Key };

/**
 * Creates an encryption key to encrypt a request's body
 */
export async function createKey(): Promise<Key> {
  return Promise.resolve(new NodeRSA({ b: 512 }));
}

/**
 * Exports an encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
export function exportKey(key: Key): string {
  return key.exportKey("pkcs8-public");
}

/**
 * Imports an encryption key, received from with a third party. Only the public key is imported.
 * @param publicKey The key in pkcs8 format
 */
export function importKey(serializedKey: string): Key {
  const key = new NodeRSA();
  key.importKey(serializedKey, "pkcs8-public");
  return key;
}

/**
 * Encrypts a body using the given key.
 * @param key The key of the recipient that will decrypt the message
 * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
 */
export function encryptBody(key: Key, body: any): any {
  if (Array.isArray(body)) {
    return body.map((i) => encryptBody(key, i));
  } else if (typeof body === "object") {
    const obj: any = {};
    for (const k in body) {
      if (body.hasOwnProperty(k)) {
        obj[k] = encryptBody(key, body[k]);
      }
    }
    return obj;
  }
  return key.encrypt(JSON.stringify(body), "base64");
}

/**
 * Decrypts a body using the given key.
 * @param key The key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
export function decryptBody(key: Key, body: any): any {
  if (!key.isPrivate()) throw new Error("Private key required to decrypt");
  if (Array.isArray(body)) {
    return body.map((i) => decryptBody(key, i));
  } else if (typeof body === "object") {
    const obj: any = {};
    for (const k in body) {
      if (body.hasOwnProperty(k)) {
        obj[k] = decryptBody(key, body[k]);
      }
    }
    return obj;
  }
  return JSON.parse(key.decrypt(body, "utf8"));
}
