import { expect } from "chai";
import NodeRSA from "node-rsa";
import EncryptionKey, {
  DEFAULT_KEY_SIZE_BITS,
  KEY_FORMAT_PRIVATE,
  KEY_FORMAT_PUBLIC,
} from "../../src/app/encryption-key";
import { dummySignature } from "../../src/app/utils";

describe("EncryptionKey", () => {
  describe("constructor", () => {
    it("accepts a privateKey and a signature", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const privateKey = kp.exportKey(KEY_FORMAT_PRIVATE);
      const signature = dummySignature();
      const ek = new EncryptionKey({privateKey, signature});
      expect(ek.publicKey).to.equal(kp.exportKey(KEY_FORMAT_PUBLIC));
      expect(ek.signature.toRSV()).to.deep.equal(signature);
    });
    it("accepts a publicKey and a signature", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ publicKey, signature });
      expect(ek.publicKey).to.equal(kp.exportKey(KEY_FORMAT_PUBLIC));
      expect(ek.signature.toRSV()).to.deep.equal(signature);
    });
    it("ignores the publicKey if a privateKey is provided", () => {
      const kp1 = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const kp2 = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const privateKey = kp1.exportKey(KEY_FORMAT_PRIVATE);
      const publicKey = kp2.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ privateKey, publicKey, signature });
      expect(ek.publicKey).to.equal(kp1.exportKey(KEY_FORMAT_PUBLIC));
      expect(ek.signature.toRSV()).to.deep.equal(signature);
    });
    it("throws error if no publicKey nor privateKey is provided", () => {
      const privateKey = "";
      const publicKey = "";
      const signature = dummySignature();
      expect(() => new EncryptionKey({ privateKey, publicKey, signature }))
        .to.throw(Error, /encryption key/i);
    });
    it("throws error if a wrong signature is provided", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = "0x1234";
      expect(() => new EncryptionKey({ publicKey, signature }))
        .to.throw(Error, /signature/);
    });
  });
  describe("#toJSON", () => {
    it("returns the publicKey and the signature", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ publicKey, signature });
      const expected = { publicKey, signature };
      const actual = ek.toJSON();
      expect(actual).to.deep.equal(expected);
    });
  });
  describe("#toABI", () => {
    it("returns the publicKey and the signature as an array", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ publicKey, signature });
      const expected = [publicKey, signature];
      const actual = ek.toABI();
      expect(actual).to.deep.equal(expected);
    });
  });
  describe("#encrypt", () => {
    it("encrypts every final value of a provided object", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ publicKey, signature });
      const data = { a: { b: { c: 1 } }, d: "a" };
      const actual = ek.encrypt(data);
      expect(actual).to.have.nested.property("a.b.c");
      expect(actual).to.have.nested.property("d");
    });
  });
  describe("#decrypt", () => {
    it("throws it the key was initialized with a public key", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const signature = dummySignature();
      const ek = new EncryptionKey({ publicKey, signature });
      expect(() => ek.decrypt({})).to.throw(Error, /private/);
    });
    it("can decrypt #encrypt output", () => {
      const kp = new NodeRSA({ b: DEFAULT_KEY_SIZE_BITS });
      const publicKey = kp.exportKey(KEY_FORMAT_PUBLIC);
      const privateKey = kp.exportKey(KEY_FORMAT_PRIVATE);
      const signature = dummySignature();
      const ekPublic = new EncryptionKey({ publicKey, signature });
      const data = { a: { b: { c: 1 } }, d: "a" };
      const encrypted = ekPublic.encrypt(data);

      const ekPrivate = new EncryptionKey({ privateKey, signature });
      const decrypted = ekPrivate.decrypt(encrypted);
      expect(decrypted).to.deep.equal(data);
    });
  });
});
