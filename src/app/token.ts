import { Buffer } from "safe-buffer";
import sha3 from "web3-utils/src/soliditySha3";
import { SignStrategy } from "../types";
import { AppParams, Request, ReadPermission } from "../structs";
import * as utils from "../utils";

interface BuildAppAccessTokenOpts {
  // A partial Request to be serialized into JWT
  request: any;
  // Read permissions necesary for the source to perfeorm its job
  extraReadPermissions: Array<any>;
  // How should we sign things as the subject when building the request?
  subjectSignStrategy?: SignStrategy;
  // How should we sign things as the reader when building the request?
  readerSignStrategy?: SignStrategy;
}

/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export async function buildToken(opts: BuildAppAccessTokenOpts) {
  const payload = await buildTokenPayload(opts);
  return buildUnsignedJwt(payload);
}

/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy.
 *
 * The jwt payload WILL NOT BE a proper Request. Instead it will have a hash
 * claim instead of signature. Hash is the value to be signed and added to the payload
 * by the reader for it to be valid JWT.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export async function buildTokenWithHash(opts: BuildAppAccessTokenOpts) {
  const payload = await buildTokenPayload(opts);
  const payloadWithHash = {
    ...payload,
    request: {
      ...payload.request,
      signature: null as any,
      hash: sha3(...utils.recoverSignatureSeed(payload.request))
    },
  };
  return buildUnsignedJwt(payloadWithHash);
}

/**
 * Returns a promise that resolves into an AppAccess AFTER signing readPermission,
 * session and extraReadPermissions have been signed with the provided sign strategy.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export async function buildTokenPayload(o: BuildAppAccessTokenOpts) {
  const opts = validateOpts(o);
  const signature = utils.dummySignature();
  const request = new Request({
    ...opts.request,
    readPermission: { ...opts.request.readPermission, signature },
    session: { ...opts.request.session, signature },
    signature,
  });
  const signedExtraReadPermissionsProm = opts.extraReadPermissions.map((rp) => {
    const unsignedRp = new ReadPermission({ ...rp, signature: utils.dummySignature() });
    return utils.signAgain(unsignedRp, opts.subjectSignStrategy);
  });
  const [readPermission, session, extraReadPermissions] = await Promise.all([
    utils.signAgain(request.readPermission, opts.subjectSignStrategy),
    utils.signAgain(request.session, opts.subjectSignStrategy),
    Promise.all(signedExtraReadPermissionsProm),
  ]);
  const signedRequest = await utils.signAgain(
    new Request({ ...request, readPermission, session }),
    opts.readerSignStrategy,
  );
  return new AppParams({ request: signedRequest, extraReadPermissions });
}

/**
 * Statically validates the provided opts and returns a safe to use version.
 * @param opts
 * @throws {TypeError} if there is an error with the opts values.
 */
function validateOpts(opts: any): Required<BuildAppAccessTokenOpts> {
  // TODO: Implement, do the js typechecing
  return Object.assign({
    subjectSignStrategy: () => utils.dummySignature(),
    readerSignStrategy: () => utils.dummySignature(),
  }, opts);
}

/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
function base64url(data: any) {
  return Buffer.from(JSON.stringify(data))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
function buildUnsignedJwt(payload: any): string {
  const headers = { typ: "JWT", alg: "none" };
  const parts = [headers, payload, ""];
  return parts.map((p) => p ? base64url(p) : "").join(".");
}
