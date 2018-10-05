import { expect } from "chai";
import ReadPermission from "../../src/structs/read-permission";
import Request from "../../src/structs/request";
import Session from "../../src/structs/session";

describe("Request", () => {
  const reader = `0x${"a".repeat(40)}`;
  const source = `0x${"b".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const manifest = `0x${"d".repeat(64)}`;
  const expiration = `${Math.floor(Date.now() / 1000) + 20 * 3600}`;
  const verifier = `0x${"d".repeat(40)}`;
  const fee = 100;
  const nonce = Date.now();
  const value = 100;
  const counter = Date.now();
  const signatureRsv = [`0x${"3".repeat(64)}`, `0x${"4".repeat(64)}`, `0x${"2".repeat(2)}`];
  const signatureHex = `0x${"3".repeat(64)}${"4".repeat(64)}${"2".repeat(2)}`;
  const readPermission = { reader, source, subject, manifest, expiration, signature: signatureRsv };
  const readPermissionArr = [reader, source, subject, manifest, expiration, signatureRsv];
  const session = { subject, verifier, fee, nonce, signature: signatureRsv };
  const sessionArr = [subject, verifier, fee, nonce, signatureRsv];
  const descriptorObj = { readPermission, session, counter, value, signature: signatureRsv };
  const descriptorArr = [readPermissionArr, sessionArr, counter, value, signatureRsv];

  describe("constructor", () => {
    it("throws error if counter is not numeric", () => {
      const createRequest = () => new Request({ ...descriptorObj, counter: "asdf" });
      expect(createRequest).to.throw(TypeError, /request.+counter/);
    });
    it("throws error if value is not numeric", () => {
      const createRequest = () => new Request({ ...descriptorObj, value: "asdf" });
      expect(createRequest).to.throw(TypeError, /request.+value/);
    });
    it("throws error if read permission is not valid", () => {
      const createRp = () => new Request({ ...descriptorObj, readPermission: {} });
      expect(createRp).to.throw(TypeError, /readPermission/);
    });
    it("throws error if session is not valid", () => {
      const createRp = () => new Request({ ...descriptorObj, session: {} });
      expect(createRp).to.throw(TypeError, /session/);
    });
    it("throws error if signature is not a valid signature strcutre", () => {
      const createRequest1 = () => new Request({ ...descriptorObj, signature: `0x${"a".repeat(64)}` });
      expect(createRequest1).to.throw(TypeError, /request.+signature/);
      const createRequest2 = () => new Request({ ...descriptorObj, signature: descriptorArr.concat(["0xad"]) });
      expect(createRequest2).to.throw(TypeError, /request.+signature/);
    });
    it("creates a frozen instance", () => expect(new Request(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new Request(descriptorObj)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new Request({ ...descriptorObj, signature: signatureHex }))
          .to.deep.equal(descriptorObj);
      });
    });
    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new Request(descriptorArr)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new Request([readPermissionArr, sessionArr, counter, value, signatureHex]))
          .to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#readPermission", () => {
    it("is a ReadPermission instance", () => {
      const request = new Request(descriptorObj);
      expect(request.readPermission).to.be.an.instanceOf(ReadPermission);
    });
  });

  describe("#session", () => {
    it("is a Session instance", () => {
      const request = new Request(descriptorObj);
      expect(request.session).to.be.an.instanceOf(Session);
    });
  });

  describe("#toABI()", () => {
    it("returns an array with the object properties", () => {
      const request = new Request(descriptorObj);
      expect(request.toABI()).to.deep
        .equal([readPermissionArr, sessionArr, counter, value, signatureRsv]);
    });
  });
});
