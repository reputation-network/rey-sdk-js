"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines whether the provided value is strictly a number or a
 * string representing a number (radix 10)
 * @param val value to check
 */
function isNumeric(val) {
    return (typeof val === "number" && Number.isFinite(val)) ||
        (typeof val === "string" && /^[0-9]+$/.test(val));
}
exports.isNumeric = isNumeric;
/**
 * Determines whether the provided value is a prefixed(0x) hex string.
 * If byteLength is specified, the provided value will also be required
 * to have the given byte length for it to retur true.
 * @param str value to check
 * @param byteLength reminder: half the amount of chars after the prefix
 */
function isHexString(str, byteLength) {
    if (typeof str !== "string") {
        return false;
    }
    if (byteLength === undefined) {
        const hexRgx = /^0x([a-f0-9]+)$/i;
        if (!hexRgx.test(str)) {
            return false;
        }
        const [, hexBytes] = hexRgx.exec(str);
        return hexBytes.length % 2 === 0;
    }
    const rgx = new RegExp(`^0x[a-f0-9]{${byteLength * 2}}$`, "i");
    return rgx.test(str);
}
exports.isHexString = isHexString;
/**
 * Determines whether the provided value is a valid address (hex prefixed string of 40 bytes)
 * @param str value to check
 */
function isAddress(str) {
    return isHexString(str, 20);
}
exports.isAddress = isAddress;
/**
 * Determines whether the provided value is a valid rsv representation of
 * a signature, meaning:
 *  - It is an array of lenght 3
 *  - first two values are prefixed hex strings of 32 bytes
 *  - last value is a prefixed hex strings of 1 byte
 * @param signature
 */
function isRsvSignature(signature) {
    const [r, s, v] = [0, 1, 2];
    return Array.isArray(signature) && signature.length === 3 &&
        isHexString(signature[r], 32) && isHexString(signature[s], 32) &&
        isHexString(signature[v], 1);
}
exports.isRsvSignature = isRsvSignature;
/**
 * Determines whether the provided value is a valid signature, meaning it
 * is either a rsv-formatted signature {@link isRsvSignature} or it is a
 * prefixed hex string of 65 bytes
 * @param signature
 * @see {@link isRsvSignature}
 */
function isSignature(signature) {
    return isHexString(signature, 65) || isRsvSignature(signature);
}
exports.isSignature = isSignature;
/**
 * Returns the rsv-formatted version of the given signature.
 * @param signature
 * @throws if provided value is not a known signature format
 */
function normalizeSignature(signature) {
    if (isRsvSignature(signature)) {
        return signature;
    }
    else if (isHexString(signature, 65)) {
        const [, r, s, v] = /^0x(.{64})(.{64})(.{2})$/.exec(signature);
        return [`0x${r}`, `0x${s}`, `0x${v}`];
    }
    else {
        throw new TypeError(`Can't parse signature: ${JSON.stringify(signature)}`);
    }
}
exports.normalizeSignature = normalizeSignature;
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
function extractIndexOrProperty(mixedName, mixed, index, propertyName, validation) {
    let value;
    if (Object.prototype.hasOwnProperty.call(mixed, propertyName)) {
        value = mixed[propertyName];
    }
    else if ((Array.isArray(mixed) && mixed.length > index) ||
        Object.prototype.hasOwnProperty.call(mixed, index)) {
        value = mixed[index];
    }
    else {
        throw new TypeError(`${mixedName} is missing ${propertyName} property`);
    }
    if (validation && !validation(value)) {
        throw new TypeError(`wrong value for ${mixedName} ${propertyName}`);
    }
    return value;
}
exports.extractIndexOrProperty = extractIndexOrProperty;
/**
 * Returns an empty prefixed hex string consisting of 65 bytes of zeros, which
 * checks out as a valid signature.
 */
function dummySignature() {
    return `0x${"0".repeat(65 * 2)}`;
}
exports.dummySignature = dummySignature;
/**
 * Returns a single dimension array, where every element inside will never be
 * an array itself after recursivelly flattening the provided object
 * @param obj entity to flatten
 */
function deepFlatten(obj) {
    if (!Array.isArray(obj)) {
        return [obj];
    }
    return obj.reduce((v, c) => v.concat(deepFlatten(c)), []);
}
exports.deepFlatten = deepFlatten;
/**
 * Builds the array used for generating the signature of any ABI
 * serializable object.
 * @param obj
 * @throws TypeError if provided object doesn't have a toABI method.
 */
function recoverSignatureSeed(obj) {
    if (typeof obj.toABI !== "function") {
        throw new TypeError("Provided object can't be serialized into ABI");
    }
    // By REY standards, when serializing to ABI, signature is always on
    // the last position of the serialized entity, so we need to remove it
    const seed = obj.toABI().slice(0, -1);
    return deepFlatten(seed);
}
exports.recoverSignatureSeed = recoverSignatureSeed;
/**
 * Given a signed entity that is an instance of Clazz, returns a new
 * Clazz instance that mirrors all the params from the original entity
 * exepct its signature. The new signature is the value returned by
 * the provided sign function after recieving the signatureSeed recovered
 * from the original entity.
 * @param element
 * @param sign
 */
function signAgain(entity, sign) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME: Add typings to entity: Check for constructor that accepts signature
        const seed = recoverSignatureSeed(entity);
        const signature = yield sign(...seed);
        const Clazz = entity.constructor;
        return new Clazz(Object.assign({}, entity, { signature }));
    });
}
exports.signAgain = signAgain;
/**
 * Returns a prefixed hex string representing the provided byte array.
 * @param bytes
 */
function bytesToHex(bytes) {
    const hex = [];
    for (let i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return '0x' + hex.join("");
}
exports.bytesToHex = bytesToHex;
/**
 * Returns a random hex string of the provided bytelength
 * @param byteLength How many bytes to include in the result.
 */
function randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    // FIXME: This should work on node-contexts and browser-contexts
    // FIXME: window.crypto might not be available
    window.crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
}
exports.randomHex = randomHex;
//# sourceMappingURL=utils.js.map