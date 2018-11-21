import { Address, Hash, HexString } from "../types";

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
