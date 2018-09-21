import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildWritePermission", () => {
  const WP = {
    writer: `0x${"a".repeat(40)}`,
    subject: `0x${"b".repeat(40)}`,
  };

  it("resolves into a WritePermission", async () => {
    const wp = await Factory.buildWritePermission(WP, SignStrategy.dummy());
    expect(wp).to.be.an.instanceOf(REY.WritePermission);
  });

  it("is signed by the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const wp = await Factory.buildWritePermission(WP, sign);
    assertSignature(wp, address);
  });

  it("is signed by the provided subject sign strategy", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKeyFromSeed("123")),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
      subject: SignStrategy.privateKey(privateKey),
    };
    const wp = await Factory.buildWritePermission(WP, sign);
    assertSignature(wp, address);
  });

  it("is signed by the default sign strategy if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = {
      default: SignStrategy.privateKey(privateKey),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    const wp = await Factory.buildWritePermission(WP, sign);
    assertSignature(wp, address);
  });

  it("throws if no subject sign strategy is available", async () => {
    const privateKey = privateKeyFromSeed("a");
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildWritePermission(WP, sign)
      .then(() => { throw new Error("Expected buildWritePermission to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });
});
