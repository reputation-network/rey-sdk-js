"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * Returns true if the provided value is a valid ethereum signature
 * v value.
 * @param v An ethereum signature v value candidate
 */
function isSignatureV(v) {
    try {
        const radix = index_1.isHexString(v, 1) ? 16 : 10;
        const vv = Number.parseInt(v, radix);
        return vv >= 0x00 && v <= 0xFF;
    }
    catch (e) {
        return false;
    }
}
exports.isSignatureV = isSignatureV;
/**
 * Parses the given value as an ethereum signature v value and returns its
 * hex representation (0x prefixed).
 * @param v An ethereum signature v value
 * @throws {TypeError} If provided value is not a valid eth signature v value
 */
function parseSignatureV(v) {
    if (!isSignatureV(v)) {
        throw new TypeError("provided v has not a valid value");
    }
    return index_1.isHexString(v, 1) ? v : index_1.addHexPrefix(Number.parseInt(v, 10).toString(16));
}
exports.parseSignatureV = parseSignatureV;
/**
 * Returns true if the provided signature is an abi-encoded reprensentation
 * of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
function isAbiSignature(signature) {
    const [r, s, v] = [0, 1, 2];
    return signature && index_1.isHexString(signature[r], 32) &&
        index_1.isHexString(signature[s], 32) && isSignatureV(signature[v]);
}
exports.isAbiSignature = isAbiSignature;
/**
 * Parses the given value as an abi-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An abi-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid abi-encoded eth signature
 */
function parseAbiSignature(signature) {
    if (!isAbiSignature(signature)) {
        throw new TypeError("provided signature is not a valid ABI signature");
    }
    return { r: signature[0], s: signature[1], v: parseSignatureV(signature[2]) };
}
exports.parseAbiSignature = parseAbiSignature;
/**
 * Parses the given signature as an ethereum signature and returns its abi
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
function toAbiSignature(signature) {
    const sig = parseSignature(signature);
    return [index_1.addHexPrefix(sig.r), index_1.addHexPrefix(sig.s), index_1.addHexPrefix(sig.v)];
}
exports.toAbiSignature = toAbiSignature;
/**
 * Returns true if the provided signature is a rsv-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An abi-encoded ethereum signature candidate
 */
function isRsvSignature(signature) {
    return signature && index_1.isHexString(signature.r, 32) &&
        index_1.isHexString(signature.s, 32) && isSignatureV(signature.v);
}
exports.isRsvSignature = isRsvSignature;
/**
 * Parses the given value as an rsv-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rsv-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rsv-encoded eth signature
 */
function parseRsvSignature(signature) {
    if (!isRsvSignature(signature)) {
        throw new TypeError("provided signature is not a valid RSV signature");
    }
    return { r: signature.r, s: signature.s, v: parseSignatureV(signature.v) };
}
exports.parseRsvSignature = parseRsvSignature;
/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
function toRsvSignature(signature) {
    return parseSignature(signature);
}
exports.toRsvSignature = toRsvSignature;
/**
 * Returns true if the provided signature is a prc-encoded signature
 * reprensentation of a an ethereum signature.
 * @param signature An rpc-encoded ethereum signature candidate
 */
function isRpcSignature(signature) {
    return typeof signature === "string" && index_1.isHexString(signature, 65);
}
exports.isRpcSignature = isRpcSignature;
/**
 * Parses the given value as an rpc-encoded ethereum signature and returns its
 * rsv representation.
 * @param signature An rpc-encoded ethereum signature
 * @throws {TypeError} If provided signature is not a valid rpc-encoded eth signature
 */
function parseRpcSignature(signature) {
    if (!isRpcSignature(signature)) {
        throw new TypeError("provided signature is not a valid RPC signature");
    }
    const [, r, s, v] = /^0x(.{64})(.{64})(.{2})$/.exec(signature);
    return { r: index_1.addHexPrefix(r), s: index_1.addHexPrefix(s), v: index_1.addHexPrefix(v) };
}
exports.parseRpcSignature = parseRpcSignature;
/**
 * Parses the given signature as an ethereum signature and returns its rpc
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
function toRpcSignature(signature) {
    const sig = parseSignature(signature);
    return index_1.addHexPrefix([sig.r, sig.s, sig.v].map(index_1.stripHexPrefix).join(""));
}
exports.toRpcSignature = toRpcSignature;
/**
 * Returns true if the provided signature is any of the known ethereum signature
 * encodings.
 * This method retruning true means it is safe to call {@link parseSignature}.
 * @param signature An ethereum signature candidate
 */
function isSignature(signature) {
    return isRsvSignature(signature) || isAbiSignature(signature) ||
        isRsvSignature(signature);
}
exports.isSignature = isSignature;
/**
 * Parses the given signature as an ethereum signature and returns its rsv
 * representation
 * @param signature An ethereum signature
 * @throws {TypeError} If provided signature has a not-known eth signature encoding
 */
function parseSignature(signature) {
    if (isRsvSignature(signature)) {
        return parseRsvSignature(signature);
    }
    else if (isAbiSignature(signature)) {
        return parseAbiSignature(signature);
    }
    else if (isRpcSignature(signature)) {
        return parseRpcSignature(signature);
    }
    else {
        throw new TypeError(`Can't parse signature ${signature}`);
    }
}
exports.parseSignature = parseSignature;
/**
 * Returns a dummy ethereum signature, rsv encoded.
 *
 * Take in mind that this signature is NOT an actually valid ethereum singature
 * (because its a huge zero filled buffer), but will pass through most of the
 * previous validations on this SDK as a valid signature.
 */
function dummySignature() {
    const zex = (n) => index_1.addHexPrefix("0".repeat(n * 2));
    return { r: zex(32), s: zex(32), v: zex(1) };
}
exports.dummySignature = dummySignature;
/**
 * Returns true if the provided signature is a dummy signature (i.e: zero
 * filled signature)
 * @param signature
 */
function isDummySignature(signature) {
    const sig = parseSignature(signature);
    const dum = dummySignature();
    return sig.r === dum.r && sig.s === dum.s && sig.v === dum.v;
}
exports.isDummySignature = isDummySignature;
//# sourceMappingURL=signature.js.map