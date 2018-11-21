import Accounts from "web3-eth-accounts";
import { toChecksumAddress } from "web3-utils";
import soliditySha3 from "web3-utils/src/soliditySha3";

/**
 * Returns a single dimension array, where every element inside will never be
 * an array itself after recursivelly flattening the provided object
 * @param obj entity to flatten
 */
function deepFlatten(obj: any): any[] {
  if (!Array.isArray(obj)) {
    return [obj];
  }
  return obj.reduce((v, c) => v.concat(deepFlatten(c)), []);
}

/**
 * Hashes the given data using the soliditySha3 algo. If the provided
 * data is an array, it will be deep flattened before hashing.
 *
 * Note that this call would be the same as calling:
 * @param data
 */
function reyHash(data: any|any[]) {
  data = Array.isArray(data) ? [data] : data;
  return soliditySha3(...deepFlatten(data));
}

/**
 * Recovers the original signer given the signed data and the signature.
 *
 * If prefixed is true, assumes that the provided data is already a hash
 * of the ethereum personal sign prefix.
 * @param data
 * @param signature
 * @param prefixed
 */
function ecRecover(data: string, signature: string, prefixed?: boolean) {
  const accounts = new Accounts();
  return accounts.recover(data, signature, prefixed);
}

/**
 * Determines if the provided string has a leading 0x or not.
 * @param hex
 */
function isHexPrefixed(hex: string) {
  if (typeof hex !== "string") {
    throw new TypeError("Provided argument is not a string");
  }
  return hex.charAt(0) === "0" && hex.charAt(1) === "x";
}

/**
 * Returns a string with a leading 0x. If the string already has
 * a leading 0x prefix, returns the string itself.
 * @param hex
 */
function addHexPrefix(hex: string) {
  return isHexPrefixed(hex) ? hex : `0x${hex}`;
}

/**
 * Removes the leading 0x from the provided string and returns the
 * new string. If the string has no 0x prefix, returns the string itself.
 * @param hex
 */
function stripHexPrefix(hex: string) {
  if (isHexPrefixed(hex)) {
    return hex.substr(2);
  } else {
    return hex;
  }
}

export {
  deepFlatten,
  reyHash,
  reyHash as hash,
  ecRecover,
  toChecksumAddress,
  addHexPrefix,
  stripHexPrefix,
};
