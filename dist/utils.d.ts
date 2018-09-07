import { Address, HexString, SignStrategy, RsvSignature, Signature } from "./types";
/**
 * Determines whether the provided value is strictly a number or a
 * string representing a number (radix 10)
 * @param val value to check
 */
export declare function isNumeric(val: any): boolean;
/**
 * Determines whether the provided value is a prefixed(0x) hex string.
 * If byteLength is specified, the provided value will also be required
 * to have the given byte length for it to retur true.
 * @param str value to check
 * @param byteLength reminder: half the amount of chars after the prefix
 */
export declare function isHexString<L extends number = any>(str: any, byteLength?: number): str is HexString<L>;
/**
 * Determines whether the provided value is a valid address (hex prefixed string of 40 bytes)
 * @param str value to check
 */
export declare function isAddress(str: any): str is Address;
/**
 * Determines whether the provided value is a valid rsv representation of
 * a signature, meaning:
 *  - It is an array of lenght 3
 *  - first two values are prefixed hex strings of 32 bytes
 *  - last value is a prefixed hex strings of 1 byte
 * @param signature
 */
export declare function isRsvSignature(signature: any): signature is RsvSignature;
/**
 * Determines whether the provided value is a valid signature, meaning it
 * is either a rsv-formatted signature {@link isRsvSignature} or it is a
 * prefixed hex string of 65 bytes
 * @param signature
 * @see {@link isRsvSignature}
 */
export declare function isSignature(signature: any): signature is Signature;
/**
 * Returns the rsv-formatted version of the given signature.
 * @param signature
 * @throws if provided value is not a known signature format
 */
export declare function normalizeSignature(signature: any): RsvSignature;
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
export declare function extractIndexOrProperty<T = any>(mixedName: string, mixed: Record<string, any>, index: number, propertyName: string, validation?: (v: T) => boolean): T;
/**
 * Returns an empty prefixed hex string consisting of 65 bytes of zeros, which
 * checks out as a valid signature.
 */
export declare function dummySignature(): Signature;
/**
 * Returns a single dimension array, where every element inside will never be
 * an array itself after recursivelly flattening the provided object
 * @param obj entity to flatten
 */
export declare function deepFlatten(obj: any): any[];
/**
 * Builds the array used for generating the signature of any ABI
 * serializable object.
 * @param obj
 * @throws TypeError if provided object doesn't have a toABI method.
 */
export declare function recoverSignatureSeed(obj: {
    toABI: () => any[];
}): (string | number)[];
/**
 * Given a signed entity that is an instance of Clazz, returns a new
 * Clazz instance that mirrors all the params from the original entity
 * exepct its signature. The new signature is the value returned by
 * the provided sign function after recieving the signatureSeed recovered
 * from the original entity.
 * @param element
 * @param sign
 */
export declare function signAgain(entity: any, sign: SignStrategy): Promise<any>;
/**
 * Returns a prefixed hex string representing the provided byte array.
 * @param bytes
 */
export declare function bytesToHex(bytes: Uint8Array | number[]): string;
/**
 * Returns a random hex string of the provided bytelength
 * @param byteLength How many bytes to include in the result.
 */
export declare function randomHex(byteLength: number): string;
