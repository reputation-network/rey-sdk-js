import { expect } from "chai";
import SignatureV2 from "../../src/structs/signature";

describe("SignatureV2", () => {
  const r = `0x${"4".repeat(64)}`;
  const s = `0x${"3".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const descriptorObj = { r, s, v };
  const descriptorArr = [r, s, v];
  const descriptorHex = `0x${"4".repeat(64)}${"3".repeat(64)}${"2".repeat(2)}`;

  describe("constructor", () => {
    it("throws error if r is not valid", () => {
      const createSignatureV2 = () => new SignatureV2({ ...descriptorObj, r: `0x$abcd` });
      expect(createSignatureV2).to.throw(TypeError, /signature.+r/);
    });
    it("throws error if s is not valid", () => {
      const createSignatureV2 = () => new SignatureV2({ ...descriptorObj, s: `0x1234` });
      expect(createSignatureV2).to.throw(TypeError, /signature.+s/);
    });
    it("throws error if v is not valid", () => {
      const createSignatureV2 = () => new SignatureV2({ ...descriptorObj, v: `0x344` });
      expect(createSignatureV2).to.throw(TypeError, /signature.+v/);
    });
    it("throws error if RPC string is not valid", () => {
      const createSignatureV2 = () => new SignatureV2(`0xadad`);
      expect(createSignatureV2).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new SignatureV2(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new SignatureV2(descriptorObj)).to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new SignatureV2(descriptorArr)).to.deep.equal(descriptorObj);
      });
    });

    context("with an RPC descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new SignatureV2(descriptorHex)).to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const signature = new SignatureV2(descriptorObj);
      expect(signature.toABI()).to.deep.equal(descriptorArr);
    });
  });

  describe("#toRSV", () => {
    it("returns an array with the object properties", () => {
      const signature = new SignatureV2(descriptorObj);
      expect(signature.toRSV()).to.deep.equal(descriptorObj);
    });
  });

  describe("#toRPC", () => {
    it("returns an array with the object properties", () => {
      const signature = new SignatureV2(descriptorObj);
      expect(signature.toRPC()).to.deep.equal(descriptorHex);
    });
  });
});
