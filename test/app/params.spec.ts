import { expect } from "chai";
import AppParams from "../../src/app/params";
import { dummySignature } from "../../src/utils";

describe("AppParams", () => {
  const params = {
    request: {
      readPermission: {
        reader: `0x${"a".repeat(40)}`,
        source: `0x${"b".repeat(40)}`,
        subject: `0x${"c".repeat(40)}`,
        manifest: `0x${"d".repeat(64)}`,
        expiration: Math.floor(Date.now() / 1000),
        signature: dummySignature(),
      },
      session: {
        subject: `0x${"c".repeat(40)}`,
        verifier: `0x${"d".repeat(40)}`,
        fee: 100,
        nonce: Date.now(),
        signature: dummySignature(),
      },
      counter: 1,
      value: 100,
      signature: dummySignature(),
    },
    extraReadPermissions: [{
      reader: `0x${"e".repeat(40)}`,
      source: `0x${"f".repeat(40)}`,
      subject: `0x${"1".repeat(40)}`,
      manifest: `0x${"d".repeat(64)}`,
      expiration: Math.floor(Date.now() / 1000),
      signature: dummySignature(),
    }],
    encryptionKey: {
      publicKey: [
        "-----BEGIN PUBLIC KEY-----",
        "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJtTffmmVumQi89aVYWoAzyEts4kiIhD",
        "Zo7ZPmgVnaKV00qEmVfejQK6p6GTQ5jX3Vj+2jnmUkN9x0ce3PYRqScCAwEAAQ==",
        "-----END PUBLIC KEY-----",
      ].join("\n"),
      signature: dummySignature(),
    },
  };

  describe("constructor", () => {
    it("throws if params has no request", () => {
      expect(() => new AppParams({ ...params, request: null }))
        .to.throw(TypeError, "request");
    });
    it("throws if params extraReadPermissions is not an array", () => {
      expect(() => new AppParams({ ...params, extraReadPermissions: {} }))
        .to.throw(TypeError, "extraReadPermissions");
    });
    it("freezes the extraReadPermissions property", () => {
      const appParams = new AppParams(params);
      expect(Object.isFrozen(appParams.extraReadPermissions)).to.equal(true);
    });
    it("freezes the object instance", () => {
      const appParams = new AppParams(params);
      expect(Object.isFrozen(appParams)).to.equal(true);
    });
  });
});
