import NodeRSA from "node-rsa";
import { Signature } from "../structs";
import { KnownSignatureFormat } from "../types";
import { dummySignature, traverseLeafs } from "./utils";

export const DEFAULT_KEY_SIZE_BITS = 512;
export const KEY_FORMAT_PUBLIC = "pkcs8-public-pem";
export const KEY_FORMAT_PRIVATE = "pkcs8-private-pem";
export const RSA_ENCRYPTION_SCHEME = "pkcs1_oaep";
export const RSA_SIGNING_SCHEME = "pkcs1-sha256";

const RSA_OPTS = {
  encryptionScheme: RSA_ENCRYPTION_SCHEME as typeof RSA_ENCRYPTION_SCHEME,
  signingScheme: RSA_SIGNING_SCHEME as typeof RSA_SIGNING_SCHEME,
};

export default class EncryptionKey {
  public static buildUnsigned() {
    const b = DEFAULT_KEY_SIZE_BITS;
    const privateKey = new NodeRSA({b}).exportKey(KEY_FORMAT_PRIVATE);
    const signature = dummySignature();
    return new EncryptionKey({ privateKey, signature });
  }

  public readonly publicKey: string;
  public readonly signature: Signature;
  protected readonly privateKey: string | null;
  private keypair: NodeRSA;

  constructor(encryptionKey: {
    publicKey?: string,
    privateKey?: string,
    signature: KnownSignatureFormat,
  }) {
    if (encryptionKey.privateKey) {
      this.keypair = new NodeRSA(encryptionKey.privateKey, KEY_FORMAT_PRIVATE, RSA_OPTS);
      this.privateKey = this.keypair.exportKey(KEY_FORMAT_PRIVATE);
      this.publicKey = this.keypair.exportKey(KEY_FORMAT_PUBLIC);
    } else if (encryptionKey.publicKey) {
      this.keypair = new NodeRSA(encryptionKey.publicKey, KEY_FORMAT_PUBLIC, RSA_OPTS);
      // NOTE: We don't use keypair.exportedKey as above because that might interfere
      // with the signature validation process. For example, if the original publicKey
      // contained one or more line feeds at the end, those will get removed by the
      // exportKey call, causing the signature to be invalid.
      this.publicKey = encryptionKey.publicKey;
      this.privateKey = null;
    } else {
      throw new Error("no encryption key format provided");
    }
    this.signature = new Signature(encryptionKey.signature);
    Object.freeze(this);
  }

  public toJSON(): any {
    return {
      publicKey: this.publicKey,
      signature: this.signature,
    };
  }

  public toString(): string {
    return this.publicKey;
  }

  public toABI() {
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
  public encrypt(obj: any): any {
    return traverseLeafs(obj,
      (v) => this.keypair.encrypt(JSON.stringify(v), "base64"));
  }

  /**
   * Decrypts every leaf value of the provided object.
   * A leaf value is anything that is NOT an array nor an object.
   * @param obj the element to decrypt
   * @throws {TypeError} if the current key does not allow decryption
   */
  public decrypt(body: any): any {
    if (!this.keypair.isPrivate()) {
      throw new Error("Current key has no private component, can't decrypt");
    }
    return traverseLeafs(body,
      (v) => JSON.parse(this.keypair.decrypt(v, "utf8")));
  }
}
