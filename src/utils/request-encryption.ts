import NodeRSA from "node-rsa";

/**
 * Creates an RSA encryption key to encrypt a request's body
 */
export function createKey() {
  return new NodeRSA({ b: 512 });
}

/**
 * Exports an RSA encryption key to share it with a third party. Only the public key is exported.
 * @param key The key, generated using createKey
 */
export function exportKey(key: NodeRSA): string {
  return key.exportKey("pkcs8-public");
}

/**
 * Imports an RSA encryption key, received from with a third party. Only the public key is imported.
 * @param serializedKey The key in pkcs8 format
 */
export function importKey(serializedKey: string): NodeRSA {
  const key = new NodeRSA();
  key.importKey(serializedKey, "pkcs8-public");
  return key;
}

/**
 * Encrypts a body using the given RSA key.
 * @param key The RSA key of the recipient that will decrypt the message
 * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
 */
export function encryptBody(key: NodeRSA, body: any): any {
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
 * Decrypts a body using the given RSA key.
 * @param key The RSA key to decrypt the message
 * @param body The body to decrypt (either an array or an object, with any arrays or objects as its values)
 */
export function decryptBody(key: NodeRSA, body: any): any {
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
