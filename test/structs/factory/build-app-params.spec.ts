import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildAppParams", () => {
  const APP = {
    request: {
      readPermission: {
        reader: `0x${"a".repeat(40)}`,
        source: `0x${"b".repeat(40)}`,
        subject: `0x${"c".repeat(40)}`,
        manifest: `0x${"d".repeat(64)}`,
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
    },
    extraReadPermissions: [{
      reader: `0x${"e".repeat(40)}`,
      source: `0x${"f".repeat(40)}`,
      subject: `0x${"1".repeat(40)}`,
      manifest: `0x${"d".repeat(64)}`,
      expiration: Math.floor(Date.now() / 1000),
    }],
  };

  it("resolves into an instance of AppParams", async () => {
    const req = await Factory.buildAppParams(APP, SignStrategy.dummy());
    expect(req).to.be.an.instanceOf(REY.AppParams);
  });

  it("signs every entity with the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const params = await Factory.buildAppParams(APP, sign);
    assertSignature(params.request.readPermission, address);
    assertSignature(params.request.session, address);
    params.extraReadPermissions.forEach((rp) => assertSignature(rp, address));
  });

  it("signs readPermissions and session with subject strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const subjectPrivateKey = privateKeyFromSeed("b");
    const subjectAddress = privateKeyToAddress(subjectPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      subject: SignStrategy.privateKey(subjectPrivateKey),
    };
    const params = await Factory.buildAppParams(APP, sign);
    assertSignature(params.request.readPermission, subjectAddress);
    assertSignature(params.request.session, subjectAddress);
    params.extraReadPermissions.forEach((rp) => assertSignature(rp, subjectAddress));
  });

  it("signs readPermissions and session with default strategy if no subject strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const params = await Factory.buildAppParams(APP, sign);
    assertSignature(params.request.readPermission, defaultAddress);
    assertSignature(params.request.session, defaultAddress);
    params.extraReadPermissions.forEach((rp) => assertSignature(rp, defaultAddress));
  });

  it("signs request with reader strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const readerPrivateKey = privateKeyFromSeed("c");
    const readerAddress = privateKeyToAddress(readerPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      reader: SignStrategy.privateKey(readerPrivateKey),
    };
    const params = await Factory.buildAppParams(APP, sign);
    assertSignature(params.request, readerAddress);
  });

  it("is signed with default strategy if no reader strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const params = await Factory.buildAppParams(APP, sign);
    assertSignature(params.request, defaultAddress);
  });

  it("throws if no subject sign strategy is available", async () => {
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildAppParams(APP, sign)
      .then(() => { throw new Error("Expected buildAppParams to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });

  it("throws if no reader sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildAppParams(APP, sign)
      .then(() => { throw new Error("Expected buildAppParams to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/reader sign strategy/));
  });
});
