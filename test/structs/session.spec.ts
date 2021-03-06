import { expect } from "chai";
import Session from "../../src/structs/session";

describe("Session", () => {
  const subject = `0x${"a".repeat(40)}`;
  const verifier = `0x${"b".repeat(40)}`;
  const fee = "100";
  const nonce = `${Date.now()}`;
  const r = `0x${"3".repeat(64)}`;
  const s = `0x${"4".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const signature = { r, s, v };
  const signatureArr = [r, s, v];
  const descriptorObj = { subject, verifier, fee, nonce, signature };
  const descriptorArr = [subject, verifier, fee, nonce, signatureArr];

  describe("constructor", () => {
    it("throws error if subject is not a valid address", () => {
      const createSession = () => new Session({ ...descriptorObj, subject: `0x${"a".repeat(39)}` });
      expect(createSession).to.throw(TypeError, /session.+subject/);
    });
    it("throws error if verifier is not a valid address", () => {
      const createSession = () => new Session({ ...descriptorObj, verifier: `0x${"a".repeat(39)}` });
      expect(createSession).to.throw(TypeError, /session.+verifier/);
    });
    it("throws error if fee is not numeric", () => {
      const createSession = () => new Session({ ...descriptorObj, fee: "asdf" });
      expect(createSession).to.throw(TypeError, /session.+fee/);
    });
    it("throws error if nonce is not defined", () => {
      const createSession = (n: any) => () => new Session({ ...descriptorObj, nonce: n });
      expect(createSession(null)).to.throw(TypeError, /session.+nonce/);
      expect(createSession(undefined)).to.throw(TypeError, /session.+nonce/);
    });
    it("throws error if signature is not valid", () => {
      const createSession = () => new Session({ ...descriptorObj, signature: {} });
      expect(createSession).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new Session(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new Session(descriptorObj)).to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Session(descriptorArr)).to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const session = new Session(descriptorObj);
      expect(session.toABI()).to.deep
        .equal([subject, verifier, fee, nonce, signatureArr]);
    });
  });
});
