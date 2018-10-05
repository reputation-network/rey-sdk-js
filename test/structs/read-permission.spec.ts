import { expect } from "chai";
import ReadPermission from "../../src/structs/read-permission";

describe("ReadPermission", () => {
  const reader = `0x${"a".repeat(40)}`;
  const source = `0x${"b".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const manifest = `0x${"d".repeat(64)}`;
  const expiration = `${Math.floor(Date.now() / 1000) + 20 * 3600}`;
  const signatureRsv = [`0x${"3".repeat(64)}`, `0x${"4".repeat(64)}`, `0x${"2".repeat(2)}`];
  const signatureHex = `0x${"3".repeat(64)}${"4".repeat(64)}${"2".repeat(2)}`;
  const descriptorObj = { reader, source, subject, manifest, expiration, signature: signatureRsv };
  const descriptorArr = [reader, source, subject, manifest, expiration, signatureRsv];

  describe("constructor", () => {
    it("throws error if reader is not a valid address", () => {
      const createRp = () => new ReadPermission({ ...descriptorObj, reader: `0x${"a".repeat(39)}` });
      expect(createRp).to.throw(TypeError, /readPermission.+reader/);
    });
    it("throws error if source is not a valid address", () => {
      const createRp = () => new ReadPermission({ ...descriptorObj, source: `0x${"a".repeat(39)}` });
      expect(createRp).to.throw(TypeError, /readPermission.+source/);
    });
    it("throws error if subject is not a valid address", () => {
      const createRp = () => new ReadPermission({ ...descriptorObj, subject: `0x${"a".repeat(39)}` });
      expect(createRp).to.throw(TypeError, /readPermission.+subject/);
    });
    it("throws error if signature is not a valid signature strcutre", () => {
      const createRp1 = () => new ReadPermission({ ...descriptorObj, signature: `0x${"a".repeat(64)}` });
      expect(createRp1).to.throw(TypeError, /readPermission.+signature/);
      const createRp2 = () => new ReadPermission({ ...descriptorObj, signature: descriptorArr.concat(["0xad"]) });
      expect(createRp2).to.throw(TypeError, /readPermission.+signature/);
    });
    it("creates a frozen instance", () => expect(new ReadPermission(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new ReadPermission(descriptorObj)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new ReadPermission({ ...descriptorObj, signature: signatureHex }))
          .to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new ReadPermission(descriptorArr)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new ReadPermission([reader, source, subject, manifest, expiration, signatureRsv]))
          .to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const readPermission = new ReadPermission(descriptorObj);
      expect(readPermission.toABI()).to.deep
        .equal([reader, source, subject, manifest, expiration, signatureRsv]);
    });
  });
});
