import { expect } from "chai";
import WritePermission from "../../src/structs/write-permission";

describe("WritePermission", () => {
  const writer = `0x${"a".repeat(40)}`;
  const subject = `0x${"c".repeat(40)}`;
  const signatureRsv = [`0x${"3".repeat(64)}`, `0x${"4".repeat(64)}`, `0x${"2".repeat(2)}`];
  const signatureHex = `0x${"3".repeat(64)}${"4".repeat(64)}${"2".repeat(2)}`;
  const descriptorObj = { writer, subject, signature: signatureRsv };
  const descriptorArr = [writer, subject, signatureRsv];

  describe("constructor", () => {
    it("throws error if writer is not a valid address", () => {
      const createWp = () => new WritePermission({ ...descriptorObj, writer: `0x${"a".repeat(39)}` });
      expect(createWp).to.throw(TypeError, /writePermission.+writer/);
    });
    it("throws error if subject is not a valid address", () => {
      const createWp = () => new WritePermission({ ...descriptorObj, subject: `0x${"a".repeat(39)}` });
      expect(createWp).to.throw(TypeError, /writePermission.+subject/);
    });
    it("throws error if signature is not a valid signature strcutre", () => {
      const createWp1 = () => new WritePermission({ ...descriptorObj, signature: `0x${"a".repeat(64)}` });
      expect(createWp1).to.throw(TypeError, /writePermission.+signature/);
      const createWp2 = () => new WritePermission({ ...descriptorObj, signature: descriptorArr.concat(["0xad"]) });
      expect(createWp2).to.throw(TypeError, /writePermission.+signature/);
    });
    it("creates a frozen instance", () => expect(new WritePermission(descriptorObj)).to.be.frozen);

    context("with an object descriptor", () => {
      it("stores its values", () => {
        expect(new WritePermission(descriptorObj)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new WritePermission({ ...descriptorObj, signature: signatureHex }))
          .to.deep.equal(descriptorObj);
      });
    });

    context("with an array descriptor", () => {
      it("stores its values and allows access by property name", () => {
        expect(new WritePermission(descriptorArr)).to.deep.equal(descriptorObj);
      });
      it("transforms rpc signatures into rsv signatures", () => {
        expect(new WritePermission([...descriptorArr.slice(0, 3), signatureHex]))
          .to.deep.equal(descriptorObj);
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
