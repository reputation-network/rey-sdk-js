import { expect } from "chai";
import DummySignStrategy from "../../src/sign-strategies/dummy";
import { dummySignature, toRsvSignature } from "../../src/utils";

describe("SignStrategy: Dummy", () => {
  it("returns a function", () => {
    const dummy = DummySignStrategy();
    expect(typeof dummy).to.equal("function");
  });
  it("signs with a rsv dummy signature", async () => {
    const dummy = DummySignStrategy();
    const expectedSignature = toRsvSignature(dummySignature());
    const actualSignature = await dummy("0xfacebeef");
    expect(actualSignature).to.deep.equal(expectedSignature);
  });
});
