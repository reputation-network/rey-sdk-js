import { Address, Hash, HexString, SignedEntity } from "../types";
import { isSignature } from "./signature";
export * from "./signature";
export * from "./struct-validations";

/**
 * Determines whether the provided value is a defined value.
 * A defined value is anything that IS NOT null NOR undefined
 * @param val value to check
 */
export function isDefined(val: any): boolean {
  return val !== null && val !== undefined;
}

/**
 * Determines whether the provided value is strictly a number or a
 * string representing a number (radix 10)
 * @param val value to check
 */
export function isNumeric(val: any): boolean {
  return (typeof val === "number" && Number.isFinite(val)) ||
    (typeof val === "string" && /^[0-9]+$/.test(val));
}

/**
 * Determines whether the provided value is a prefixed(0x) hex string.
 * If byteLength is specified, the provided value will also be required
 * to have the given byte length for it to retur true.
 * @param str value to check
 * @param byteLength reminder: half the amount of chars after the prefix
 */
export function isHexString<L extends number = any>(
  str: any,
  byteLength?: number,
): str is HexString<L> {
  if (typeof str !== "string") {
    return false;
  }

  if (byteLength === undefined) {
    const hexRgx = /^0x([a-f0-9]+)$/i;
    if (!hexRgx.test(str)) {
      return false;
    }
    const [, hexBytes] = hexRgx.exec(str)!;
    return hexBytes.length % 2 === 0;
  }

  const rgx = new RegExp(`^0x[a-f0-9]{${byteLength * 2}}$`, "i");
  return rgx.test(str);
}

/**
 * Determines whether the provided value is a valid address (hex prefixed string of 20 bytes)
 * @param str value to check
 */
export function isAddress(str: any): str is Address {
  return isHexString(str, 20);
}

/**
 * Determines whether the provided value is a valid hash (hex prefixed string of 32 bytes)
 * @param str value to check
 */
export function isHash(str: any): str is Hash {
  return isHexString(str, 32);
}

/**
 * Returns the value for the given propertyName or index from the provided
 * mixed. If both keys have a value, propertyName value will be returned.
 *
 * @param mixedName A name representing mixed, used for clarity when throwing errors
 * @param mixed The entity to be inspected
 * @param index
 * @param propertyName
 * @param validation A function that allows validating the value before returning it
 * @throws TypeError if the provided object has not a propertyName nor a index defined
 * @throws TypeError if validation returns false
 */
export function extractIndexOrProperty<T = any>(
  mixedName: string,
  mixed: Record<string, any>,
  index: number,
  propertyName: string,
  validation?: (v: T) => boolean,
): T {
  let value: T;
  if (Object.prototype.hasOwnProperty.call(mixed, propertyName)) {
    value = mixed[propertyName];
  } else if (
    (Array.isArray(mixed) && mixed.length > index) ||
    Object.prototype.hasOwnProperty.call(mixed, index)
  ) {
    value = mixed[index];
  } else {
    throw new TypeError(`${mixedName} is missing ${propertyName} property`);
  }
  if (validation && !validation(value)) {
    throw new TypeError(`wrong value for ${mixedName} ${propertyName}`);
  }
  return value;
}

/**
 * Returns a single dimension array, where every element inside will never be
 * an array itself after recursivelly flattening the provided object
 * @param obj entity to flatten
 */
export function deepFlatten(obj: any): any[] {
  if (!Array.isArray(obj)) {
    return [obj];
  }
  return obj.reduce((v, c) => v.concat(deepFlatten(c)), []);
}

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

export function reyHash(data: any[]) {
  const soliditySha3 = require("web3-utils/src/soliditySha3");
  return soliditySha3(...deepFlatten(data));
}

export function addHexPrefix(hex: string) {
  if (typeof hex !== "string") {
    throw new TypeError("Provided argument is not a string");
  }
  return /^0x/.test(hex) ? hex : `0x${hex}`;
}

export function stripHexPrefix(hex: string) {
  if (typeof hex !== "string") {
    throw new TypeError("Provided argument is not a string");
  }
  return hex.replace(/^0x/, "");
}
