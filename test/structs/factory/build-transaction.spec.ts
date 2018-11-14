import { expect } from "chai";
import * as SignStrategy from "../../../src/sign-strategies";
import * as REY from "../../../src/structs";
import Factory from "../../../src/structs/factory";
import { assertSignature, privateKeyFromSeed, privateKeyToAddress } from "./utils";

describe("Factory.buildTransaction", () => {
  const session = {
    subject: `0x${"c".repeat(40)}`,
    verifier: `0x${"d".repeat(40)}`,
    fee: 100,
    nonce: Date.now(),
  };
  const T = {
    request: {
      readPermission: {
        reader: `0x${"a".repeat(40)}`,
        source: `0x${"b".repeat(40)}`,
        subject: `0x${"c".repeat(40)}`,
        manifest: `0x${"d".repeat(64)}`,
        expiration: Math.floor(Date.now() / 1000),
      },
      session,
      counter: 1,
      value: 100,
    },
    proof: {
      writePermission: {
        writer: `0x${"a".repeat(40)}`,
        subject: `0x${"b".repeat(40)}`,
      },
      session,
    },
  };

  it("resolves into a Transaction", async () => {
    const transaction = await Factory.buildTransaction(T, SignStrategy.dummy());
    expect(transaction).to.be.an.instanceOf(REY.Transaction);
  });

  it("signs every entity with the provided sign strategy function", async () => {
    const privateKey = privateKeyFromSeed("a");
    const address = privateKeyToAddress(privateKey);
    const sign = SignStrategy.privateKey(privateKey);
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction, address);
    assertSignature(transaction.request.readPermission, address);
    assertSignature(transaction.request.session, address);
    assertSignature(transaction.proof.writePermission, address);
    assertSignature(transaction.proof.session, address);
  });

  it("signs readPermission and request's session with subject strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const subjectPrivateKey = privateKeyFromSeed("b");
    const subjectAddress = privateKeyToAddress(subjectPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      subject: SignStrategy.privateKey(subjectPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.request.readPermission, subjectAddress);
    assertSignature(transaction.request.session, subjectAddress);
  });

  it("signs readPermission and request's session with default strategy if no subject strategy is available",
     async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.request.readPermission, defaultAddress);
    assertSignature(transaction.request.session, defaultAddress);
  });

  it("signs writePermission and proof's session with subject strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const subjectPrivateKey = privateKeyFromSeed("b");
    const subjectAddress = privateKeyToAddress(subjectPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      subject: SignStrategy.privateKey(subjectPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.proof.writePermission, subjectAddress);
    assertSignature(transaction.proof.session, subjectAddress);
  });

  it("signs writePermission and proof's session with default strategy if no subject strategy is available",
     async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.proof.writePermission, defaultAddress);
    assertSignature(transaction.proof.session, defaultAddress);
  });

  it("signs request with reader strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const readerPrivateKey = privateKeyFromSeed("c");
    const readerAddress = privateKeyToAddress(readerPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      reader: SignStrategy.privateKey(readerPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.request, readerAddress);
  });

  it("signs request with default strategy if no reader strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction, defaultAddress);
  });

  it("throws if no subject sign strategy is available", async () => {
    const sign = {
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildTransaction(T, sign)
      .then(() => { throw new Error("Expected buildTransaction to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });

  it("throws if no reader sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildTransaction(T, sign)
      .then(() => { throw new Error("Expected buildTransaction to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/reader sign strategy/));
  });

  it("signs proof with writer strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const writerPrivateKey = privateKeyFromSeed("c");
    const writerAddress = privateKeyToAddress(writerPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      writer: SignStrategy.privateKey(writerPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.proof, writerAddress);
  });

  it("signs proof with default strategy if no writer strategy is available", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const defaultAddress = privateKeyToAddress(defaultPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction.proof, defaultAddress);
  });

  it("throws if no subject sign strategy is available", async () => {
    const sign = {
      writer: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildTransaction(T, sign)
      .then(() => { throw new Error("Expected buildTransaction to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/subject sign strategy/));
  });

  it("throws if no writer sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildTransaction(T, sign)
      .then(() => { throw new Error("Expected buildTransaction to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/writer sign strategy/));
  });

  it("is signed with verifier strategy", async () => {
    const defaultPrivateKey = privateKeyFromSeed("a");
    const verifierPrivateKey = privateKeyFromSeed("c");
    const verifierAddress = privateKeyToAddress(verifierPrivateKey);
    const sign = {
      default: SignStrategy.privateKey(defaultPrivateKey),
      verifier: SignStrategy.privateKey(verifierPrivateKey),
    };
    const transaction = await Factory.buildTransaction(T, sign);
    assertSignature(transaction, verifierAddress);
  });

  it("throws if no verifier sign strategy is available", async () => {
    const sign = {
      subject: SignStrategy.privateKey(privateKeyFromSeed("456")),
      reader: SignStrategy.privateKey(privateKeyFromSeed("456")),
      writer: SignStrategy.privateKey(privateKeyFromSeed("456")),
    };
    return Factory.buildTransaction(T, sign)
      .then(() => { throw new Error("Expected buildTransaction to throw, but did not throw"); })
      .catch((e) => expect(e).to.match(/verifier sign strategy/));
  });
});
