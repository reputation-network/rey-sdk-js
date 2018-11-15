import { AbiSignature, RpcSignature, RsvSignature } from "../types";
/**
 * Returns true if the provided value is a valid ethereum signature
 * v value.
 * @param v An ethereum signature v value candidate
 */
export declare function isSignatureV(v: any): boolean;
/**
 * Parses the given value as an ethereum signature v value and returns its
 * hex representation (0x prefixed).
 * @param v An ethereum signature v value
 * @throws {TypeError} If provided value is not a valid eth signature v value
 */
export declare function parseSignatureV(v: any): string;
/**
 * Returns true if the provided signature is an abi-encoded reprensentation
 * of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
export declare function isAbiSignature(signature: any): signature is AbiSignature;
/**
 * Parses the given value as an abi-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An abi-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid abi-encoded eth signature
 */
export declare function parseAbiSignature(signature: any): RsvSignature;
/**
 * Parses the given signature as an ethereum signature and returns its abi
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export declare function toAbiSignature(signature: any): AbiSignature;
/**
 * Returns true if the provided signature is a rsv-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
export declare function isRsvSignature(signature: any): signature is RsvSignature;
/**
 * Parses the given value as an rsv-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rsv-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rsv-encoded eth signature
 */
export declare function parseRsvSignature(signature: any): RsvSignature;
/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export declare function toRsvSignature(signature: any): RsvSignature;
/**
 * Returns true if the provided signature is a prc-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An rpc-encoded ethereum signature candidate
 */
export declare function isRpcSignature(signature: any): signature is RpcSignature;
/**
 * Parses the given value as an rpc-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rpc-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rpc-encoded eth signature
 */
export declare function parseRpcSignature(signature: any): RsvSignature;
/**
 * Parses the given signature as an ethereum signature and returns its rpc
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export declare function toRpcSignature(signature: any): RpcSignature;
/**
 * Returns true if the provided signature is any of the known ethereum signature
 * encodings.
 * This method retruning true means it is safe to call {@link parseSignature}.
 * @param signature An ethereum signature candidate
 */
export declare function isSignature(signature: any): boolean;
/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
export declare function parseSignature(signature: any): RsvSignature;
/**
 * Returns a dummy ethereum signature, rsv encoded.
 *
 * Take in mind that this signature is NOT an actually valid ethereum singature
 * (because its a huge zero filled buffer), but will pass through most of the
 * previous validations on this SDK as a valid signature.
 */
export declare function dummySignature(): RsvSignature;
/**
 * Returns true if the provided signature is a dummy signature (i.e: zero
 * filled signature)
 * @param signature
 */
export declare function isDummySignature(signature: any): boolean;
