import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildSession", () => {
  const S = {
    subject: `0x${"a".repeat(40)}`,
    verifier: `0x${"b".repeat(40)}`,
    fee: 100,
    nonce: Date.now(),
  };

  it("resolves into a Session", async () => {
    const s = await Factory.buildSession(S, SignStrategy.dummy());
    expect(s).to.be.an.instanceOf(REY.Session);
  });

  it("is signed by the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const s = await Factory.buildSession(S, sign);
    assertSignature(s, address);
  });

  it("is signed by the provided subject sign strategy", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKeyFromSeed("123")),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
      subject: SignStrategy.privateKey(privateKey),
    };
    const s = await Factory.buildSession(S, sign);
    assertSignature(s, address);
  });

  it("is signed by the default sign strategy if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKey),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    const s = await Factory.buildSession(S, sign);
    assertSignature(s, address);
  });

  it("throws if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildSession(S, sign)
      .then(() => { throw new Error("Expected buildSession to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });
});
