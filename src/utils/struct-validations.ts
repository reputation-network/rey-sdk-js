import assert from "assert";
import Accounts from "web3-eth-accounts";
import { toChecksumAddress } from "web3-utils";
import { ReadPermission, Request, Session } from "../structs";
import { Address, HexString, RsvSignature } from "../types";
import { recoverSignatureSeed, reyHash, toRpcSignature } from "./index";

/**
 * Validates that the given signature has been produced by signer
 * signing the provided data.
 * @param data Data that was signed by signer and generated signature
 * @param signature The signature of the data, produced by signer
 * @param signer The address of the signer
 * @throws {Error} if cant recover a signer from the given signature/data
 * @throws {Error} if recovered signer and provided signer don't match
 */
export function validateSignature(data: HexString<any>, signature: RsvSignature, signer: Address) {
  const accounts = new Accounts();
  const rpcSignature = toRpcSignature(signature);
  const recoveredSigner = accounts.recover(data, rpcSignature);
  assert(
    recoveredSigner === toChecksumAddress(signer),
    `recovered signer was ${recoveredSigner} instead of ${signer}`,
  );
}

/**
 * Validates the provided read permission
 * @throws {Error} expiration value is a past timestamp
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by subject
 */
export function validateReadPermission(rp: ReadPermission) {
  assert(
    Number(rp.expiration) > Math.floor(Date.now() / 1000),
    `read permission is expired`,
  );
  try {
    const rpHash = reyHash(recoverSignatureSeed(rp));
    validateSignature(rpHash, rp.signature, rp.subject);
  } catch (e) {
    throw new Error(`read permission signature error: ${e.message || e}`);
  }
}

/**
 * Validates the provided session
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by subject
 */
export function validateSession(session: Session) {
  try {
    const sHash = reyHash(recoverSignatureSeed(session));
    validateSignature(sHash, session.signature, session.subject);
  } catch (e) {
    throw new Error(`session signature error: ${e.message || e}`);
  }
}

/**
 * Validates the provided request
 * @throws {Error} readPermission is not valid (see {@link validateReadPermission})
 * @throws {Error} session is not valid (see {@link validateSession})
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by readPermission.reader
 */
export function validateRequest(req: Request) {
  validateReadPermission(req.readPermission);
  validateSession(req.session);
  assert(
    req.session.subject === req.readPermission.subject,
    `read permissions subject(${req.readPermission.subject}) is different from sesison subject ${req.session.subject}`,
  );
  try {
    const reqHash = reyHash(recoverSignatureSeed(req));
    validateSignature(reqHash, req.signature, req.readPermission.reader);
  } catch (e) {
    throw new Error(`request signature error: ${e.message || e}`);
  }
}
