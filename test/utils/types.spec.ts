import { expect } from "chai";
import * as u from "../../src/utils/types";

describe("Utils", () => {
  describe("isDefined", () => {
    it("returns false for null");
    it("returns false for undefined");
    it("returns true for booleans");
    it("returns true for numbers");
    it("returns true for strings");
    it("returns true for objects");
    it("returns true for arrays");
  });
  describe("isNumeric", () => {
    it("returns true for a number");
    it("returns true for a string containing a number");
    it("returns false for a string containing non-numeric characters");
    it("returns false for a boolean");
    it("returns false for an object");
    it("returns false for an array");
  });
  describe("isHexString", () => {
    context("when passing a single argument", () => {
      it("returns false if provided argument is not a string", () => {
        expect(u.isHexString(1)).to.equal(false);
        expect(u.isHexString(true)).to.equal(false);
        expect(u.isHexString([])).to.equal(false);
        expect(u.isHexString({})).to.equal(false);
      });
      it("returns false if provided argument contains a non hex character", () => {
        expect(u.isHexString("0xfacebeefZ")).to.equal(false);
      });
      it("returns false if provided argument has not an even number of hex characters", () => {
        expect(u.isHexString("0xfacebeef1")).to.equal(false);
      });
      it("returns false if provided argument has not the 0x prefix", () => {
        expect(u.isHexString("facebeef")).to.equal(false);
      });
      it("returns true if provided argument is a valid hex string of any length", () => {
        expect(u.isHexString("0x1234")).to.equal(true);
        expect(u.isHexString("0xfacebeef")).to.equal(true);
      });
    });
    context("when passing two arguments", () => {
      it("returns true if provided argument is a valid hex string of given length", () => {
        expect(u.isHexString("0x1234", 2)).to.equal(true);
        expect(u.isHexString("0xfacebeef", 4)).to.equal(true);
      });
    });
  });
  describe("isAddress", () => {
    it("returns false for a non hex-prefixed string", () => {
      expect(u.isAddress("asdf")).to.equal(false);
      expect(u.isAddress(genHex(20, false))).to.equal(false);
    });
    it("returns false for a prefixed hex that is not 20 bytes", () => {
      expect(u.isAddress(genHex(10))).to.equal(false);
      expect(u.isAddress(genHex(30))).to.equal(false);
    });
    it("returns true for a prefixed hex string of 20 bytes", () => {
      expect(u.isAddress(genHex(20))).to.equal(true);
    });
  });
  describe("isHash", () => {
    it("returns false for a non hex-prefixed string", () => {
      expect(u.isHash("asdf")).to.equal(false);
      expect(u.isHash(genHex(32, false))).to.equal(false);
    });
    it("returns false for a prefixed hex that is not 32 bytes", () => {
      expect(u.isHash(genHex(10))).to.equal(false);
      expect(u.isHash(genHex(30))).to.equal(false);
    });
    it("returns true for a prefixed hex string of 32 bytes", () => {
      expect(u.isHash(genHex(32))).to.equal(true);
    });
  });
});

function genHex(byteLength: number, prefixed: boolean = true): string {
  const bytes = require("crypto").randomBytes(byteLength).toString("hex");
  return prefixed ? `0x${bytes}` : bytes;
}
