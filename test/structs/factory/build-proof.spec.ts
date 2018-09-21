import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildProof", () => {
  const P = {
    writePermission: {
      writer: `0x${"a".repeat(40)}`,
      subject: `0x${"b".repeat(40)}`,
    },
    session: {
      subject: `0x${"c".repeat(40)}`,
      verifier: `0x${"d".repeat(40)}`,
      fee: 100,
      nonce: Date.now(),
    },
  };

  it("resolves into a Proof", async () => {
    const pf = await Factory.buildProof(P, SignStrategy.dummy());
    expect(pf).to.be.an.instanceOf(REY.Proof);
  });

  it("signs every entity with the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const pf = await Factory.buildProof(P, sign);
    assertSignature(pf, address);
    assertSignature(pf.writePermission, address);
    assertSignature(pf.session, address);
  });

  it("signs writePermission and session with subject strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const subjectPrivateKey = privateKeyFromSeed("b");
    const subjectAddress = privateKeyToAddress(subjectPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      subject: SignStrategy.privateKey(subjectPrivateKey),
    };
    const pf = await Factory.buildProof(P, sign);
    assertSignature(pf.writePermission, subjectAddress);
    assertSignature(pf.session, subjectAddress);
  });

  it("signs writePermission and session with default strategy if no subject strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const pf = await Factory.buildProof(P, sign);
    assertSignature(pf.writePermission, defaultAddress);
    assertSignature(pf.session, defaultAddress);
  });

  it("is signed with writer strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const writerPrivateKey = privateKeyFromSeed("c");
    const writerAddress = privateKeyToAddress(writerPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      writer: SignStrategy.privateKey(writerPrivateKey),
    };
    const pf = await Factory.buildProof(P, sign);
    assertSignature(pf, writerAddress);
  });

  it("is signed with default strategy if no writer strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const pf = await Factory.buildProof(P, sign);
    assertSignature(pf, defaultAddress);
  });

  it("throws if no subject sign strategy is available", async () => {
    const sign = {
      writer: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildProof(P, sign)
      .then(() => { throw new Error("Expected buildProof to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });

  it("throws if no writer sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildProof(P, sign)
      .then(() => { throw new Error("Expected buildProof to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/writer sign strategy/));
  });
});
