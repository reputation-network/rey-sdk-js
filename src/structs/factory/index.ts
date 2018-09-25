import { SignedEntity, SignStrategy } from "../../types";
import { dummySignature, recoverSignatureSeed, toRpcSignature } from "../../utils";
import AppParams from "../app-params";
import Proof from "../proof";
import ReadPermission from "../read-permission";
import Request from "../request";
import Session from "../session";
import WritePermission from "../write-permission";

interface SignStrategyByActor {
  default?: SignStrategy;
  subject?: SignStrategy;
  source?: SignStrategy;
  reader?: SignStrategy;
  verifier?: SignStrategy;
  writer?: SignStrategy;
}

interface Constructor<T> { new(...args: any[]): T; }
const signerByEntity = new WeakMap<Constructor<SignedEntity>, Exclude<keyof SignStrategyByActor, "default">>([
  [Proof, "writer"],
  [ReadPermission, "subject"],
  [Request, "reader"],
  [Session, "subject"],
  [WritePermission, "subject"],
]);

type SignStrategyForFactory = SignStrategy | SignStrategyByActor;

export async function build<T extends SignedEntity>(
  clazz: Constructor<T>,
  payload: any,
  signStrategy: SignStrategyForFactory,
): Promise<T> {
  const signer = signerByEntity.get(clazz);
  if (!signer) {
    throw new Error(`Couldn't determine signer for class ${clazz}[${clazz.name}]`);
  }
  const signBy = buildSignStrategyByActor(signStrategy);
  const sign = signBy[signer]!;
  let signature = (payload || {}).signature || dummySignature();
  const t = new clazz({ ...payload, signature });
  if (!signature || toRpcSignature(signature) === toRpcSignature(dummySignature())) {
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
  return build(ReadPermission, readPermission, signStrategy);
}

export async function buildSession(session: any, signStrategy: SignStrategyForFactory) {
  return build(Session, session, signStrategy);
}

export async function buildWritePermission(writePermission: any, signStrategy: SignStrategyForFactory) {
  return build(WritePermission, writePermission, signStrategy);
}

export async function buildRequest(req: any, signStrategy: SignStrategyForFactory) {
  const [readPermission, session] = await Promise.all([
    buildReadPermission(req.readPermission, signStrategy),
    buildSession(req.session, signStrategy),
  ]);
  return build(Request, { ...req, readPermission, session }, signStrategy);
}

export async function buildProof(proof: any, signStrategy: SignStrategyForFactory) {
  const [writePermission, session] = await Promise.all([
    buildWritePermission(proof.writePermission, signStrategy),
    buildSession(proof.session, signStrategy),
  ]);
  return build(Proof, { ...proof, writePermission, session }, signStrategy);
}

export async function buildAppParams(appParams: any, signStrategy: SignStrategyForFactory) {
  const [request, extraReadPermissions] = await Promise.all([
    buildRequest(appParams.request, signStrategy),
    Promise.all(appParams.extraReadPermissions
      .map((rp: any) => buildReadPermission(rp, signStrategy))),
  ]);
  return new AppParams({ request, extraReadPermissions });
}

export default {
  build,
  buildReadPermission,
  buildSession,
  buildWritePermission,
  buildRequest,
  buildProof,
  buildAppParams,
};
