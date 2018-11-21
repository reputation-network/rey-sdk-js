import { Address, HexString, KnownSignatureFormat, SignedEntity } from "../types";
import { deepFlatten, ecRecover, reyHash, toChecksumAddress } from "./shared";
import { isSignature, toRpcSignature } from "./signature";

/**
 * Builds the array used for generating the signature of any ABI
 * serializable object.
 * @param obj
 * @throws {TypeError} if provided object doesn't have a toABI method.
 * @throws {TypeError} if toABI() doesn't return a signatre in its last position
 */
export function recoverSignatureSeed(obj: SignedEntity) {
  if (typeof obj.toABI !== "function") {
    throw new TypeError("Provided object can't be serialized into ABI");
  }
  // By REY standards, when serializing to ABI, signature is always on
  // the last position of the serialized entity, so we need to remove it
  const abi = obj.toABI();
  const signature = abi.pop();
  if (!isSignature(signature)) {
    throw new Error(`Last element of ABI serialized object was not a signature`);
  }
  return deepFlatten(abi) as Array<string | number>;
}

/**
 * Asserts that the given signature has been produced by signer
 * signing the provided data.
 * @param data Data that was signed by signer and generated signature
 * @param signature The signature of the data, produced by signer
 * @param signer The address of the signer
 * @throws {Error} if cant recover a signer from the given signature/data
 * @throws {Error} if recovered signer and provided signer don't match
 */
export function validateSignature(
  data: HexString<any>,
  signature: KnownSignatureFormat,
  signer: Address,
) {
  const actualSigner = ecRecover(data, toRpcSignature(signature));
  const expectedSigner = toChecksumAddress(signer);
  if (actualSigner !== expectedSigner) {
    throw new Error(`Signer mismatch. Got ${actualSigner}, expected: ${expectedSigner}`);
  }
}

/**
 * Asserts that the given entity has been signed by the provided signer.
 * @param signed
 * @param signer
 * @throws {Error} if cant recover a signer from the given signature/data
 * @throws {Error} if recovered signer and provided signer don't match
 */
export function validateStructSignature(
  signed: SignedEntity,
  signer: Address,
) {
  const msg = reyHash(recoverSignatureSeed(signed));
  const signautre = signed.signature;
  validateSignature(msg, signautre, signer);
}
