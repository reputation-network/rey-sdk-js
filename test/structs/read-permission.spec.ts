import { expect } from "chai";
import ReadPermission from "../../src/structs/read-permission";

describe("ReadPermission", () => {
  const reader = `0x${"a".repeat(40)}`;
  const source = `0x${"b".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const manifest = `0x${"d".repeat(64)}`;
  const expiration = `${Math.floor(Date.now() / 1000) + 20 * 3600}`;
  const r = `0x${"3".repeat(64)}`;
  const s = `0x${"4".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const signature = { r, s, v };
  const signatureArr = [r, s, v];
  const descriptorObj = { reader, source, subject, manifest, expiration, signature };
  const descriptorArr = [reader, source, subject, manifest, expiration, signatureArr];

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
    it("throws error if manifest is not a valid hash", () => {
      const createRp = () => new ReadPermission({ ...descriptorObj, manifest: `0x${"a".repeat(63)}` });
      expect(createRp).to.throw(TypeError, /readPermission.+manifest/);
    });
    it("throws error if signature is not valid", () => {
      const createRp = () => new ReadPermission({ ...descriptorObj, signature: {} });
      expect(createRp).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new ReadPermission(descriptorObj)).to.be.frozen);
    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new ReadPermission(descriptorObj)).to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new ReadPermission(descriptorArr)).to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const readPermission = new ReadPermission(descriptorObj);
      expect(readPermission.toABI()).to.deep
        .equal([reader, source, subject, manifest, expiration, signatureArr]);
    });
  });
});
