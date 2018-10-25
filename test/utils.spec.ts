import { expect } from "chai";
import * as utils from "../src/utils";

describe("Utils", () => {
  describe("isHexString", () => {
    context("when passing a single argument", () => {
      it("returns false if provided argument is not a string", () => {
        expect(utils.isHexString(1)).to.equal(false);
        expect(utils.isHexString(true)).to.equal(false);
        expect(utils.isHexString([])).to.equal(false);
        expect(utils.isHexString({})).to.equal(false);
      });
      it("returns false if provided argument contains a non hex character", () => {
        expect(utils.isHexString("0xfacebeefZ")).to.equal(false);
      });
      it("returns false if provided argument has not an even number of hex characters", () => {
        expect(utils.isHexString("0xfacebeef1")).to.equal(false);
      });
      it("returns false if provided argument has not the 0x prefix", () => {
        expect(utils.isHexString("facebeef")).to.equal(false);
      });
      it("returns true if provided argument is a valid hex string of any length", () => {
        expect(utils.isHexString("0x1234")).to.equal(true);
        expect(utils.isHexString("0xfacebeef")).to.equal(true);
      });
    });
    context("when passing a two arguments", () => {
      it("returns true if provided argument is a valid hex string of given length", () => {
        expect(utils.isHexString("0x1234", 2)).to.equal(true);
        expect(utils.isHexString("0xfacebeef", 4)).to.equal(true);
      });
    });
  });
  describe("isAddress", () => {
    it("returns false for a non hex-prefixed string", () => {
      expect(utils.isAddress("asdf")).to.equal(false);
      expect(utils.isAddress(genHex(20, false))).to.equal(false);
    });
    it("returns false for a prefixed hex that is not 20 bytes", () => {
      expect(utils.isAddress(genHex(10))).to.equal(false);
      expect(utils.isAddress(genHex(30))).to.equal(false);
    });
    it("returns true for a prefixed hex string of 20 bytes", () => {
      expect(utils.isAddress(genHex(20))).to.equal(true);
    });
  });
  describe("isRsvSignature", () => {
    it("returns false for anything that is not an array", () => {
      expect(utils.isRsvSignature(false)).to.equal(false);
      expect(utils.isRsvSignature(123)).to.equal(false);
      expect(utils.isRsvSignature("str")).to.equal(false);
      expect(utils.isRsvSignature({})).to.equal(false);
    });
    it("returns false for a rsv signature encoded as a hex string", () => {
      expect(utils.isRsvSignature(genHex(65))).to.equal(false);
    });
    it("returns false for an array for three prefixed hex strings of random byte lenghts", () => {
      expect(utils.isRsvSignature([genHex(32), genHex(32), genHex(2)])).to.equal(false);
      expect(utils.isRsvSignature([genHex(32), genHex(40), genHex(1)])).to.equal(false);
      expect(utils.isRsvSignature([genHex(40), genHex(32), genHex(1)])).to.equal(false);
    });
    it("returns true for an array for three prefixed hex strings of length 32, 32, 1 bytes", () => {
      expect(utils.isRsvSignature([genHex(32), genHex(32), genHex(1)])).to.equal(true);
    });
  });
  describe("normalizeSignature", () => {
    it("throws error if provided signautre is not an rsv array nor a 65 bytes hex string", () => {
      expect(() => utils.normalizeSignature(true)).to.throw(TypeError, /parse.+signature/i);
      expect(() => utils.normalizeSignature(1234)).to.throw(TypeError, /parse.+signature/i);
      expect(() => utils.normalizeSignature("string")).to.throw(TypeError, /parse.+signature/i);
      expect(() => utils.normalizeSignature({})).to.throw(TypeError, /parse.+signature/i);
      expect(() => utils.normalizeSignature([])).to.throw(TypeError, /parse.+signature/i);
      expect(() => utils.normalizeSignature(genHex(20))).to.throw(TypeError, /parse.+signature/i);
    });
    it("returns the provided signature if it is already a valid rsv signature", () => {
      const signature = [genHex(32), genHex(32), genHex(1)];
      expect(utils.normalizeSignature(signature)).to.deep.equal(signature);
    });
    it("returns the rsv version of the provided signature if it it is a prefixed 65 bytes hex string ", () => {
      const signature = [genHex(32, false), genHex(32, false), genHex(1, false)];
      const signatureWithPrefix = signature.map((s) => `0x${s}`);
      const hexSignature = `0x${signature.join("")}`;
      expect(utils.normalizeSignature(hexSignature)).to.deep.equal(signatureWithPrefix);
    });
  });
  describe("requestEncryption", () => {
    const re = utils.RequestEncryption;
    it("creates a key that is exported and imported", () => {
      const key = re.createKey();
      const serialization = re.exportKey(key);
      expect(re.exportKey(re.importKey(serialization))).to.equal(serialization);
    });
    it("encrypts a body's values with an imported key and decrypts them", () => {
      const key = re.createKey();
      const importedKey = re.importKey(re.exportKey(key));

      const body: any = [{ some: "value", another: "value", aNumber: 33 }, "something else"];
      const encryptedBody = re.encryptBody(importedKey, body);

      expect(encryptedBody[0]["some"]).to.not.eql(body[0]["some"]);
      expect(encryptedBody[0]["another"]).to.not.eql(body[0]["another"]);
      expect(encryptedBody[0]["aNumber"]).to.not.eql(body[0]["aNumber"]);
      expect(typeof(encryptedBody[0]["aNumber"])).to.equal("string");
      expect(encryptedBody[1]).to.not.eql(body[1]);

      const decryptedBody = re.decryptBody(key, encryptedBody);
      expect(decryptedBody).to.deep.equal(body);
    });
  });
});

function genHex(byteLength: number, prefixed: boolean = true): string {
  const bytes = require("crypto").randomBytes(byteLength).toString("hex");
  return prefixed ? `0x${bytes}` : bytes;
}
