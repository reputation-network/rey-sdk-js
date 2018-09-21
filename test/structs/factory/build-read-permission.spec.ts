import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildReadPermission", () => {
  const RP = {
    reader: `0x${"a".repeat(40)}`,
    source: `0x${"b".repeat(40)}`,
    subject: `0x${"c".repeat(40)}`,
    expiration: Math.floor(Date.now() / 1000),
  };

  it("resolves into a ReadPermission", async () => {
    const rp = await  Factory.buildReadPermission(RP, SignStrategy.dummy());
    expect(rp).to.be.an.instanceOf(REY.ReadPermission);
  });

  it("is signed by the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const rp = await Factory.buildReadPermission(RP, sign);
    assertSignature(rp, address);
  });

  it("is signed by the provided subject sign strategy", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKeyFromSeed("123")),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
      subject: SignStrategy.privateKey(privateKey),
    };
    const rp = await Factory.buildReadPermission(RP, sign);
    assertSignature(rp, address);
  });

  it("is signed by the default sign strategy if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKey),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    const rp = await Factory.buildReadPermission(RP, sign);
    assertSignature(rp, address);
  });

  it("throws if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildReadPermission(RP, sign)
      .then(() => { throw new Error("Expected buildReadPermission to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });
});
