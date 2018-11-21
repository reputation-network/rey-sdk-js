import {
  isAddress, isDefined, isHash, isNumeric,
  parseSignature, toAbiSignature, toRpcSignature, toRsvSignature,
} from "../utils";

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
function extractIndexOrProperty<T = any>(
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

export {
  extractIndexOrProperty,
  isAddress,
  isHash,
  isDefined,
  isNumeric,
  parseSignature,
  toAbiSignature,
  toRpcSignature,
  toRsvSignature,
};
