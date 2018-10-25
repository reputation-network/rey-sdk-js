import { expect } from "chai";
import Transaction from "../../src/structs/transaction";

describe("Transaction", () => {
  const reader = `0x${"a".repeat(40)}`;
  const source = `0x${"b".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const manifest = `0x${"d".repeat(64)}`;
  const expiration = `${Math.floor(Date.now() / 1000) + 20 * 3600}`;
  const verifier = `0x${"d".repeat(40)}`;
  const writer = `0x${"e".repeat(40)}`;
  const fee = 100;
  const nonce = Date.now();
  const value = 100;
  const counter = Date.now();
  const r = `0x${"3".repeat(64)}`;
  const s = `0x${"4".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const signature = { r, s, v };
  const signatureArr = [r, s, v];
  const readPermission = { reader, source, subject, manifest, expiration, signature };
  const readPermissionArr = [reader, source, subject, manifest, expiration, signatureArr];
  const session = { subject, verifier, fee, nonce, signature };
  const sessionArr = [subject, verifier, fee, nonce, signatureArr];
  const request = { readPermission, session, counter, value, signature };
  const requestArr = [readPermissionArr, sessionArr, counter, value, signatureArr];
  const writePermission = { writer, subject, signature };
  const writePermissionArr = [writer, subject, signatureArr];
  const proof = { writePermission, session, signature };
  const proofArr = [writePermissionArr, sessionArr, signatureArr];
  const descriptorObj = { request, proof, signature };
  const descriptorArr = [requestArr, proofArr, signatureArr];

  describe("constructor", () => {
    it("throws error if request is not valid", () => {
      const createTransaction = () => new Transaction({ ...descriptorObj, request: {} });
      expect(createTransaction).to.throw(TypeError, /request/);
    });
    it("throws error if proof is not valid", () => {
      const createTransaction = () => new Transaction({ ...descriptorObj, proof: {} });
      expect(createTransaction).to.throw(TypeError, /proof/);
    });
    it("throws error if signature is not valid", () => {
      const createTransaction = () => new Transaction({ ...descriptorObj, signature: {} });
      expect(createTransaction).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new Transaction(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new Transaction(descriptorObj)).to.deep.equal(descriptorObj);
      });
    });
    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Transaction(descriptorArr)).to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const transaction = new Transaction(descriptorObj);
      expect(transaction.toABI()).to.deep
        .equal([requestArr, proofArr, signatureArr]);
    });
  });
});
