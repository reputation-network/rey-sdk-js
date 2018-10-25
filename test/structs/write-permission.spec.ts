import { expect } from "chai";
import WritePermission from "../../src/structs/write-permission";

describe("WritePermission", () => {
  const writer = `0x${"a".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const r = `0x${"3".repeat(64)}`;
  const s = `0x${"4".repeat(64)}`;
  const v = `0x${"2".repeat(2)}`;
  const signature = { r, s, v };
  const signatureArr = [r, s, v];
  const descriptorObj = { writer, subject, signature };
  const descriptorArr = [writer, subject, signatureArr];

  describe("constructor", () => {
    it("throws error if writer is not a valid address", () => {
      const createWp = () => new WritePermission({ ...descriptorObj, writer: `0x${"a".repeat(39)}` });
      expect(createWp).to.throw(TypeError, /writePermission.+writer/);
    });
    it("throws error if subject is not a valid address", () => {
      const createWp = () => new WritePermission({ ...descriptorObj, subject: `0x${"a".repeat(39)}` });
      expect(createWp).to.throw(TypeError, /writePermission.+subject/);
    });
    it("throws error if signature is not valid", () => {
      const createWp = () => new WritePermission({ ...descriptorObj, signature: {} });
      expect(createWp).to.throw(TypeError, /signature/);
    });
    it("creates a frozen instance", () => expect(new WritePermission(descriptorObj)).to.be.frozen);

    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new WritePermission(descriptorObj)).to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new WritePermission(descriptorArr)).to.deep.equal(descriptorObj);
      });
    });
  });

  describe("#toABI", () => {
    it("returns an array with the object properties", () => {
      const writePermission = new WritePermission(descriptorObj);
      expect(writePermission.toABI()).to.deep.equal(descriptorArr);
    });
  });
});
