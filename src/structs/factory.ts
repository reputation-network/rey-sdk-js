import { SignedEntity, SignStrategy } from "../types";
import { recoverSignatureSeed } from "../utils";
import { dummySignature, isDummySignature } from "../utils/signature";
import Proof from "./proof";
import ReadPermission from "./read-permission";
import Request from "./request";
import Session from "./session";
import Transaction from "./transaction";
import WritePermission from "./write-permission";

interface SignStrategyByActor {
  default?: SignStrategy;
  subject?: SignStrategy;
  source?: SignStrategy;
  reader?: SignStrategy;
  verifier?: SignStrategy;
  writer?: SignStrategy;
}

interface Constructor<T> { new(...args: any[]): T; }

export type SignStrategyForFactory = SignStrategy | SignStrategyByActor;

export async function build<T extends SignedEntity>(
  clazz: Constructor<T>,
  payload: any,
  sign: SignStrategy,
): Promise<T> {
  let signature = (payload || {}).signature || dummySignature();
  const t = new clazz({ ...payload, signature });
  if (!signature || isDummySignature(signature)) {
    signature = await sign(...recoverSignatureSeed(t));
  }
  return new clazz({ ...(t as any), signature });
}

export function buildSignStrategyByActor(o: SignStrategyForFactory): Required<SignStrategyByActor> {
  const coarce = (name: keyof SignStrategyByActor) => {
    if (typeof o === "object" && typeof o[name] === "function") {
      return o[name];
    } else if (typeof o === "object" && typeof o.default === "function") {
      return o.default;
    } else if (typeof o === "function") {
      return o;
    } else {
      throw new TypeError(`Could not find suitable ${name} sign strategy in ${o}`);
    }
  };
  return Object.defineProperties({}, {
    default: { get: () => coarce("default") },
    subject: { get: () => coarce("subject") },
    source: { get: () => coarce("source") },
    reader: { get: () => coarce("reader") },
    verifier: { get: () => coarce("verifier") },
    writer: { get: () => coarce("writer") },
  });
}

export async function buildReadPermission(readPermission: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  return build(ReadPermission, readPermission, signBy.subject);
}

export async function buildSession(session: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  return build(Session, session, signBy.subject);
}

export async function buildWritePermission(writePermission: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  return build(WritePermission, writePermission, signBy.subject);
}

export async function buildRequest(req: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  const [readPermission, session] = await Promise.all([
    buildReadPermission(req.readPermission, signBy.subject),
    buildSession(req.session, signBy.subject),
  ]);
  return build(Request, { ...req, readPermission, session }, signBy.reader);
}

export async function buildProof(proof: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  const [writePermission, session] = await Promise.all([
    buildWritePermission(proof.writePermission, signBy.subject),
    buildSession(proof.session, signBy.subject),
  ]);
  return build(Proof, { ...proof, writePermission, session }, signBy.writer);
}

export async function buildTransaction(transaction: any, signStrategy: SignStrategyForFactory) {
  const signBy = buildSignStrategyByActor(signStrategy);
  const [request, proof] = await Promise.all([
    buildRequest(transaction.request, signStrategy),
    buildProof(transaction.proof, signStrategy),
  ]);
  return build(Transaction, { ...transaction, request, proof }, signBy.verifier);
}

export default {
  build,
  buildReadPermission,
  buildSession,
  buildWritePermission,
  buildRequest,
  buildProof,
  buildTransaction,
};
