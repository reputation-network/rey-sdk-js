import NodeRSA from "node-rsa";
import { dummySignature } from ".";
import SignatureV2 from "../structs/signature";

export default class EncryptionKey {
  public signature: SignatureV2;
  private keypair?: NodeRSA;

  /**
   * Imports an encryption key if given, received from with a third party. Only the public key is imported.
   * @param serializedKey The public key in pkcs8 format
   */
  constructor(serializedKey?: any) {
    this.signature = new SignatureV2(dummySignature());
    if (!serializedKey) { return; }
    this.keypair = new NodeRSA();
    this.keypair.importKey(serializedKey.publicKey, "pkcs8-public");
    this.signature = new SignatureV2(serializedKey.signature);
  }

  /**
   * Creates an encryption key to encrypt a request's body.
   */
  public async createPair(): Promise<void> {
    this.keypair = new NodeRSA({ b: 512 });
    return Promise.resolve();
  }

  /**
   * Exports an encryption key to share it with a third party. Only the public key is exported.
   */
  public toJSON(): any {
    return { publicKey: this.exportPublicKey(), signature: this.signature };
  }

  /**
   * Encrypts a body.
   * @param body The body to encrypt (either an array or an object, with any arrays or objects as its values)
   */
  public encrypt(body: any): any {
    if (!this.keypair) { throw new Error("Key pair was not initialized"); }
    if (Array.isArray(body)) {
      return body.map((i) => this.encrypt(i));
    } else if (typeof body === "object") {
      const obj: any = {};
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
  public decrypt(body: any): any {
    if (!this.keypair || !this.keypair.isPrivate()) { throw new Error("Private key required to decrypt"); }
    if (Array.isArray(body)) {
      return body.map((i) => this.decrypt(i));
    } else if (typeof body === "object") {
      const obj: any = {};
      for (const k in body) {
        if (body.hasOwnProperty(k)) {
          obj[k] = this.decrypt(body[k]);
        }
      }
      return obj;
    }
    return JSON.parse(this.keypair.decrypt(body, "utf8"));
  }

  public toABI() {
    return [
      this.exportPublicKey(),
      this.signature.toABI(),
    ];
  }

  private exportPublicKey() {
    if (!this.keypair) { throw new Error("Key pair was not initialized"); }
    return this.keypair.exportKey("pkcs8-public");
  }
}
