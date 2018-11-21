import { AbiSignature, RpcSignature, RsvSignature } from "../types";
import { addHexPrefix, stripHexPrefix } from "./shared";
import { isHexString } from "./types";

/**
 * Returns true if the provided value is a valid ethereum signature
 * v value.
 * @param v An ethereum signature v value candidate
 */
export function isSignatureV(v: any) {
  try {
    const radix = isHexString(v, 1) ? 16 : 10;
    const vv = Number.parseInt(v, radix);
    return vv >= 0x00 && v <= 0xFF;
  } catch (e) {
    return false;
  }
}

/**
 * Parses the given value as an ethereum signature v value and returns its
 * hex representation (0x prefixed).
 * @param v An ethereum signature v value
 * @throws {TypeError} If provided value is not a valid eth signature v value
 */
export function parseSignatureV(v: any) {
  if (!isSignatureV(v)) {
    throw new TypeError("provided v has not a valid value");
  }
  return isHexString(v, 1) ? v : addHexPrefix(Number.parseInt(v, 10).toString(16));
}

/**
 * Returns true if the provided signature is an abi-encoded reprensentation
 * of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
export function isAbiSignature(signature: any): signature is AbiSignature {
  const [r, s, v] = [0, 1, 2];
  return signature && isHexString(signature[r], 32) &&
    isHexString(signature[s], 32) && isSignatureV(signature[v]);
}

/**
 * Parses the given value as an abi-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An abi-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid abi-encoded eth signature
 */
export function parseAbiSignature(signature: any): RsvSignature {
  if (!isAbiSignature(signature)) {
    throw new TypeError("provided signature is not a valid ABI signature");
  }
  return { r: signature[0], s: signature[1], v: parseSignatureV(signature[2]) };
}

/**
 * Parses the given signature as an ethereum signature and returns its abi
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export function toAbiSignature(signature: any): AbiSignature {
  const sig = parseSignature(signature);
  return [addHexPrefix(sig.r), addHexPrefix(sig.s), addHexPrefix(sig.v)];
}

/**
 * Returns true if the provided signature is a rsv-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
export function isRsvSignature(signature: any): signature is RsvSignature {
  return signature && isHexString(signature.r, 32) &&
    isHexString(signature.s, 32) && isSignatureV(signature.v);
}

/**
 * Parses the given value as an rsv-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rsv-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rsv-encoded eth signature
 */
export function parseRsvSignature(signature: any): RsvSignature {
  if (!isRsvSignature(signature)) {
    throw new TypeError("provided signature is not a valid RSV signature");
  }
  return { r: signature.r, s: signature.s, v: parseSignatureV(signature.v) };
}

/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export function toRsvSignature(signature: any): RsvSignature {
  return parseSignature(signature);
}

/**
 * Returns true if the provided signature is a prc-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An rpc-encoded ethereum signature candidate
 */
export function isRpcSignature(signature: any): signature is RpcSignature {
  return typeof signature === "string" && isHexString(signature, 65);
}

/**
 * Parses the given value as an rpc-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rpc-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rpc-encoded eth signature
 */
export function parseRpcSignature(signature: any): RsvSignature {
  if (!isRpcSignature(signature)) {
    throw new TypeError("provided signature is not a valid RPC signature");
  }
  const [, r, s, v] = /^0x(.{64})(.{64})(.{2})$/.exec(signature)!;
  return { r: addHexPrefix(r), s: addHexPrefix(s), v: addHexPrefix(v) };
}

/**
 * Parses the given signature as an ethereum signature and returns its rpc
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export function toRpcSignature(signature: any): RpcSignature {
  const sig = parseSignature(signature);
  return addHexPrefix([sig.r, sig.s, sig.v].map(stripHexPrefix).join(""));
}

/**
 * Returns true if the provided signature is any of the known ethereum signature
 * encodings.
 * This method retruning true means it is safe to call {@link parseSignature}.
 * @param signature An ethereum signature candidate
 */
export function isSignature(signature: any) {
  return isRsvSignature(signature) || isAbiSignature(signature) ||
    isRsvSignature(signature);
}

/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export function parseSignature(signature: any): RsvSignature {
  if (isRsvSignature(signature)) {
    return parseRsvSignature(signature);
  } else if (isAbiSignature(signature)) {
    return parseAbiSignature(signature);
  } else if (isRpcSignature(signature)) {
    return parseRpcSignature(signature);
  } else {
    throw new TypeError(`Can't parse signature ${signature}`);
  }
}

/**
 * Returns a dummy ethereum signature, rsv encoded.
 *
 * Take in mind that this signature is NOT an actually valid ethereum singature
 * (because its a huge zero filled buffer), but will pass through most of the
 * previous validations on this SDK as a valid signature.
 */
export function dummySignature(): RsvSignature {
  const zex = (n: number) => addHexPrefix("0".repeat(n * 2));
  return { r: zex(32), s: zex(32), v: zex(1) };
}

/**
 * Returns true if the provided signature is a dummy signature (i.e: zero
 * filled signature)
 * @param signature
 */
export function isDummySignature(signature: any) {
  const sig = parseSignature(signature);
  const dum = dummySignature();
  return sig.r === dum.r && sig.s === dum.s && sig.v === dum.v;
}
