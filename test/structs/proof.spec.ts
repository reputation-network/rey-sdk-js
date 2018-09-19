import { expect } from "chai";
import Proof from "../../src/structs/proof";
import Session from "../../src/structs/session";
import WritePermission from "../../src/structs/write-permission";

describe("Proof", () => {
  const writer = `0x${"a".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const verifier = `0x${"d".repeat(40)}`;
  const fee = 100;
  const nonce = Date.now();
  const signatureRsv = [`0x${"3".repeat(64)}`, `0x${"4".repeat(64)}`, `0x${"2".repeat(2)}`];
  const signatureHex = `0x${"3".repeat(64)}${"4".repeat(64)}${"2".repeat(2)}`;
  const writePermission = { writer, subject, signature: signatureRsv };
  const writePermissionArr = [writer, subject, signatureRsv];
  const session = { subject, verifier, fee, nonce, signature: signatureRsv };
  const sessionArr = [subject, verifier, fee, nonce, signatureRsv];
  const descriptorObj = { writePermission, session, signature: signatureRsv };
  const descriptorArr = [writePermissionArr, sessionArr, signatureRsv];

  describe("constructor", () => {
    it("throws error if write permission is not valid", () => {
      const createProof = () => new Proof({ ...descriptorObj, writePermission: {} });
      expect(createProof).to.throw(TypeError, /writePermission/);
    });
    it("throws error if session is not valid", () => {
      const createProof = () => new Proof({ ...descriptorObj, session: {} });
      expect(createProof).to.throw(TypeError, /session/);
    });
    it("throws error if signature is not a valid signature strcutre", () => {
      const createProof1 = () => new Proof({ ...descriptorObj, signature: `0x${"a".repeat(64)}` });
      expect(createProof1).to.throw(TypeError, /proof.+signature/);
      const createProof2 = () => new Proof({ ...descriptorObj, signature: descriptorArr.concat(["0xad"]) });
      expect(createProof2).to.throw(TypeError, /proof.+signature/);
    });
    it("creates a frozen instance", () => expect(new Proof(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new Proof(descriptorObj)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new Proof({ ...descriptorObj, signature: signatureHex }))
          .to.deep.equal(descriptorObj);
      });
    });
    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Proof(descriptorArr)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new Proof([writePermissionArr, sessionArr, signatureHex]))
          .to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#writePermission", () => {
    it("is a WritePermission instance", () => {
      const proof = new Proof(descriptorObj);
      expect(proof.writePermission).to.be.an.instanceOf(WritePermission);
    });
  });

  describe("#session", () => {
    it("is a Session instance", () => {
      const proof = new Proof(descriptorObj);
      expect(proof.session).to.be.an.instanceOf(Session);
    });
  });

  describe("#toABI()", () => {
    it("returns an array with the object properties", () => {
      const proof = new Proof(descriptorObj);
      expect(proof.toABI()).to.deep
        .equal([writePermissionArr, sessionArr, signatureRsv]);
    });
  });
});
