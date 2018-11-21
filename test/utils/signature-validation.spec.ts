import { expect } from "chai";
import { dummySignature } from "../../src/utils";
import { recoverSignatureSeed, validateSignature, validateStructSignature } from "../../src/utils/signature-validation";

describe("Signature validation utils", () => {
  describe("recoverSignatureSeed", () => {
    it("throws if provided object does not have a toABI method", () => {
      const struct = {};
      expect(() => recoverSignatureSeed(struct as any)).to.throw(Error, /ABI/);
    });
    it("throws if provided object toABI call does not return a signature as the last element", () => {
      const struct = { signature: dummySignature(), toABI: () => [null] };
      expect(() => recoverSignatureSeed(struct)).to.throw(Error, /ABI.+signature/);
    });
    it("returns a flattened version of the toABI call without signature", () => {
      const struct = {
        signature: dummySignature(),
        toABI: () => [[1, "a", {}], "b", dummySignature()],
      };
      expect(recoverSignatureSeed(struct)).to.deep
        .equal([1, "a", {}, "b"]);
    });
  });
  describe("validateSignature", () => {
    it("throws if provided data+signature was not generated by provided signer");
  });
  describe("validateStructSignature", () => {
    it("throws if provided struct was not signed by provided signer");
  });
});