import crypto, { Key } from "crypto";

export { Key };

/**
 * Creates an encryption key to encrypt a request's body
 */
export async function createKey(): Promise<Key> {
  return new Promise<Key>((resolve, reject) => {
    crypto.generateKeyPair("rsa", { modulusLength: 512,
                                    publicKeyEncoding: { type: "pkcs1", format: "pem" },
                                    privateKeyEncoding: {type: "pkcs1", format: "pem" } },
                            (err: Error, publicKey: string, privateKey: string) => {
                              if (err) return reject(err);
                              return resolve({ publicKey, privateKey });
                            });
  })
}

/**
 * Exports an encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
export function exportKey(key: Key): string {
  return key.publicKey;
}

/**
 * Imports an encryption key, received from with a third party. Only the public key is imported.
 * @param publicKey The key in pkcs8 format
 */
export function importKey(publicKey: string): Key {
  return { publicKey: publicKey };
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
  return crypto.publicEncrypt(key.publicKey, Buffer.from(JSON.stringify(body))).toString("base64");
}

/**
 * Decrypts a body using the given key.
 * @param key The key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
export function decryptBody(key: Key, body: any): any {
  if (!key.privateKey) throw new Error("Private key required to decrypt");
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
  return JSON.parse(crypto.privateDecrypt(key.privateKey, Buffer.from(body, "base64")).toString());
}
