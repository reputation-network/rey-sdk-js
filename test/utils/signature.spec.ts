import { expect } from "chai";
import * as u from "../../src/utils/signature";
import { genHex } from "./helpers";

describe("Signature utils", () => {
  describe("isAbiSignature", () => {
    it("returns true for an array of 32, 32, 1 bytes", () => {
      expect(u.isAbiSignature([genHex(32), genHex(32), genHex(1)])).to.equal(true);
    });
    it("returns true for an array-like object with 0, 1, 2 properties bytes", () => {
      expect(u.isAbiSignature({ 0: genHex(32), 1: genHex(32), 2: genHex(1)})).to.equal(true);
    });
    it("returns false for anything that is not an array-like length 3 object", () => {
      expect(u.isAbiSignature(`0x1234`)).to.equal(false);
      expect(u.isAbiSignature(`0x1234`)).to.equal(false);
    });
  });
});
