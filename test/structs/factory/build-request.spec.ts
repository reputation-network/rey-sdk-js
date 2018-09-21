import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildRequest", () => {
  const REQ = {
    readPermission: {
      reader: `0x${"a".repeat(40)}`,
      source: `0x${"b".repeat(40)}`,
      subject: `0x${"c".repeat(40)}`,
      expiration: Math.floor(Date.now() / 1000),
    },
    session: {
      subject: `0x${"c".repeat(40)}`,
      verifier: `0x${"d".repeat(40)}`,
      fee: 100,
      nonce: Date.now(),
    },
    counter: 1,
    value: 100,
  };

  it("resolves into a Request", async () => {
    const req = await Factory.buildRequest(REQ, SignStrategy.dummy());
    expect(req).to.be.an.instanceOf(REY.Request);
  });

  it("signs every entity with the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const req = await Factory.buildRequest(REQ, sign);
    assertSignature(req, address);
    assertSignature(req.readPermission, address);
    assertSignature(req.session, address);
  });

  it("signs readPermission and session with subject strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const subjectPrivateKey = privateKeyFromSeed("b");
    const subjectAddress = privateKeyToAddress(subjectPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      subject: SignStrategy.privateKey(subjectPrivateKey),
    };
    const req = await Factory.buildRequest(REQ, sign);
    assertSignature(req.readPermission, subjectAddress);
    assertSignature(req.session, subjectAddress);
  });

  it("signs readPermission and session with default strategy if no subject strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const req = await Factory.buildRequest(REQ, sign);
    assertSignature(req.readPermission, defaultAddress);
    assertSignature(req.session, defaultAddress);
  });

  it("is signed with reader strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const readerPrivateKey = privateKeyFromSeed("c");
    const readerAddress = privateKeyToAddress(readerPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      reader: SignStrategy.privateKey(readerPrivateKey),
    };
    const req = await Factory.buildRequest(REQ, sign);
    assertSignature(req, readerAddress);
  });

  it("is signed with default strategy if no reader strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const req = await Factory.buildRequest(REQ, sign);
    assertSignature(req, defaultAddress);
  });

  it("throws if no subject sign strategy is available", async () => {
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildRequest(REQ, sign)
      .then(() => { throw new Error("Expected buildRequest to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });

  it("throws if no reader sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildRequest(REQ, sign)
      .then(() => { throw new Error("Expected buildRequest to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/reader sign strategy/));
  });
});
