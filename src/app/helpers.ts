import { AppParams, ReadPermission, Request, Session } from "../structs";
import { SignStrategy } from "../types";
import { dummySignature, reyHash, signAgain } from "../utils";
import { UnsignedAppParams, WithRequestHash } from "./types";

export async function lazySignEntity<T>(
  entity: any,
  Entity: { new(t: Partial<T>|null): T },
  signStrategy?: SignStrategy,
): Promise<T> {
  if (entity && !entity.signature && signStrategy) {
    entity = await signAgain(
      new Entity({ ...entity, signature: dummySignature() }),
      signStrategy,
      Entity,
    );
  }
  return new Entity(entity);
}

export async function buildAppParams(
  partialAppParams: UnsignedAppParams,
  opts: BuildAppParamsOpts,
): Promise<AppParams> {
  const { request, extraReadPermissions } = partialAppParams;
  const readPermission = await lazySignEntity(
    request.readPermission, ReadPermission, opts.subjectSignStrategy);
  const session = await lazySignEntity(
    request.session, Session, opts.subjectSignStrategy);
  const req = await lazySignEntity(
    { ...request, readPermission, session }, Request, opts.readerSignStrategy);
  const extraRp = await Promise.all(extraReadPermissions.map(
    (rp) => lazySignEntity(rp, ReadPermission, opts.subjectSignStrategy)));
  return new AppParams({
    request: new Request(req),
    extraReadPermissions: extraRp,
  });
}

export async function buildAppParamsWithHash(
  partialAppParams: UnsignedAppParams,
  opts: BuildAppParamsOpts,
): Promise<UnsignedAppParams & WithRequestHash> {
  const appParams = await buildAppParams(partialAppParams, opts);
  return {
    ...appParams,
    request: {
      ...appParams.request,
      hash: reyHash(appParams.request.toABI()),
    },
  };
}

interface BuildAppParamsOpts {
  // Should we sign things as the subject? If so, how?
  subjectSignStrategy?: SignStrategy;
  // Should we sign things as the reader? If so, how?
  readerSignStrategy?: SignStrategy;
}
