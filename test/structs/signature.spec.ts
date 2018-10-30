import { expect } from "chai";
import Signature from "../../src/structs/signature";

describe("Signature", () => {
  const r = `0x${"4".repeat(64)}`;
  const s = `0x${"3".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const signatureRSV = {r, s, v};
  const signatureABI = [r, s, v];
  const signatureRPC = `0x${"4".repeat(64)}${"3".repeat(64)}${"2".repeat(2)}`;

  describe("constructor", () => {
    it("throws error if r is not valid", () => {
      const createSignature = () => new Signature({ ...signatureRSV, r: `0x$abcd` });
      expect(createSignature).to.throw(TypeError, /signature/);
    });
    it("throws error if s is not valid", () => {
      const createSignature = () => new Signature({ ...signatureRSV, s: `0x1234` });
      expect(createSignature).to.throw(TypeError, /signature/);
    });
    it("throws error if v is not valid", () => {
      const createSignature = () => new Signature({ ...signatureRSV, v: `0x344` });
      expect(createSignature).to.throw(TypeError, /signature/);
    });
    it("throws error if RPC string is not valid", () => {
      const createSignature = () => new Signature(`0xadad`);
      expect(createSignature).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new Signature(signatureRSV)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new Signature(signatureRSV)).to.deep.equal(signatureRSV);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Signature(signatureABI)).to.deep.equal(signatureRSV);
      });
    });

    context("with an RPC descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Signature(signatureRPC)).to.deep.equal(signatureRSV);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const signature = new Signature(signatureRSV);
      expect(signature.toABI()).to.deep.equal(signatureABI);
    });
  });

  describe("#toRSV", () => {
    it("returns an object with the object properties", () => {
      const signature = new Signature(signatureRSV);
      expect(signature.toRSV()).to.deep.equal(signatureRSV);
    });
  });

  describe("#toRPC", () => {
    it("returns an string with the object properties", () => {
      const signature = new Signature(signatureRSV);
      expect(signature.toRPC()).to.equal(signatureRPC);
    });
  });

  describe("#toString", () => {
    it("returns the RPC version of the signature", () => {
      const signature = new Signature(signatureRSV);
      expect(signature.toString()).to.equal(signature.toRPC());
      expect(signature.toString()).to.equal(signatureRPC);
    });
  });

  context("when JSON.stringify-ing a Signature", () => {
    context("by itself", () => {
      it("stringifies into an RSV object format", () => {
        const signature = new Signature(signatureRSV);
        expect(JSON.stringify(signature)).to.equal(JSON.stringify(signatureRSV));
      });
    });
    context("as another object property", () => {
      it("stringifies into an RPC string signature", () => {
        const signature = new Signature(signatureRSV);
        expect(JSON.stringify({ signature }))
          .to.equal(JSON.stringify({ signature: signatureRPC }));
      });
    });
  });
});
