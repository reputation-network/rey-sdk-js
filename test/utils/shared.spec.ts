import { expect } from "chai";
import { addHexPrefix, deepFlatten, stripHexPrefix } from "../../src/utils/shared";

describe("Utils: shared", () => {
  describe("addHexPrefix", () => {
    it("throws if provided argument is not a string", () => {
      expect(() => addHexPrefix(true as any)).to.throw(TypeError, /string/);
      expect(() => addHexPrefix(1 as any)).to.throw(TypeError, /string/);
      expect(() => addHexPrefix({} as any)).to.throw(TypeError, /string/);
      expect(() => addHexPrefix([] as any)).to.throw(TypeError, /string/);
    });
    it("adds '0x' to a string if it doesn't have it already", () => {
      expect(addHexPrefix("abcdefg")).to.equal("0xabcdefg");
    });
    it("doesn't add '0x' to a string if it does have it already", () => {
      expect(addHexPrefix("0xabcdefg")).to.equal("0xabcdefg");
    });
  });
  describe("stripHexPrefix", () => {
    it("throws if provided argument is not a string", () => {
      expect(() => stripHexPrefix(true as any)).to.throw(TypeError, /string/);
      expect(() => stripHexPrefix(1 as any)).to.throw(TypeError, /string/);
      expect(() => stripHexPrefix({} as any)).to.throw(TypeError, /string/);
      expect(() => stripHexPrefix([] as any)).to.throw(TypeError, /string/);
    });
    it("removes '0x' to a string if it does have it", () => {
      expect(stripHexPrefix("0xabcdefg")).to.equal("abcdefg");
    });
    it("does nothing if the string doesn't have a leading '0x'", () => {
      expect(stripHexPrefix("abcdefg")).to.equal("abcdefg");
    });
  });
  describe("deepFlatten", () => {
    it("returns a flat array for any non array param", () => {
      expect(deepFlatten(true)).to.deep.equal([true]);
      expect(deepFlatten(1)).to.deep.equal([1]);
      expect(deepFlatten("asdf")).to.deep.equal(["asdf"]);
      expect(deepFlatten({a: 1})).to.deep.equal([{a: 1}]);
    });
    it("returns a flat array for a non-flat array param", () => {
      expect(deepFlatten([true, 1, "asdf", { a: 1 }]))
        .to.deep.equal([true, 1, "asdf", { a: 1 }]);
      expect(deepFlatten([[true, 1], ["asdf", { a: 1 }]]))
        .to.deep.equal([true, 1, "asdf", { a: 1 }]);
    });
  });
});
