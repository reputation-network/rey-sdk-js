"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const encryption_key_1 = __importDefault(require("./encryption-key"));
exports.EncryptionKey = encryption_key_1.default;
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
 * Determines whether the provided value is a valid address (hex prefixed string of 20 bytes)
 * @param str value to check
 */
function isAddress(str) {
    return isHexString(str, 20);
}
exports.isAddress = isAddress;
/**
 * Determines whether the provided value is a valid hash (hex prefixed string of 32 bytes)
 * @param str value to check
 */
function isHash(str) {
    return isHexString(str, 32);
}
exports.isHash = isHash;
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
 * Returns the rsv-array-formatted version of the given signature.
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
 * Returns a rpc formatted signatrue version of the given signature.
 * @param signature
 * @throws if provided value is not a known signature format
 */
function toRpcSignature(signature) {
    if (isHexString(signature, 65)) {
        return signature;
    }
    else if (isRsvSignature(signature)) {
        return `0x${signature.map((p) => p.replace(/^0x/, "")).join("")}`;
    }
    else if (typeof signature.toRPC === "function") {
        return signature.toRPC();
    }
    else {
        throw new TypeError(`Can't parse signature: ${JSON.stringify(signature)}`);
    }
}
exports.toRpcSignature = toRpcSignature;
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
 * @throws {TypeError} if provided object doesn't have a toABI method.
 * @throws {TypeError} if toABI() doesn't return a signatre in its last position
 */
function recoverSignatureSeed(obj) {
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
    return deepFlatten(abi);
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
function signAgain(entity, sign, clazz) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME: Add typings to entity: Check for constructor that accepts signature
        const seed = recoverSignatureSeed(entity);
        const signature = yield sign(...seed);
        return new clazz(Object.assign({}, entity, { signature }));
    });
}
exports.signAgain = signAgain;
/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
function base64url(data) {
    return Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
exports.base64url = base64url;
/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
function encodeUnsignedJwt(payload) {
    const headers = { typ: "JWT", alg: "none" };
    const parts = [headers, payload, ""];
    return parts.map((p) => p ? base64url(p) : "").join(".");
}
exports.encodeUnsignedJwt = encodeUnsignedJwt;
function decodeUnsignedJwt(jwt) {
    const [headers, payload, signature] = jwt.split(".");
    return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
}
exports.decodeUnsignedJwt = decodeUnsignedJwt;
function reyHash(data) {
    const soliditySha3 = require("web3-utils/src/soliditySha3");
    return soliditySha3(...deepFlatten(data));
}
exports.reyHash = reyHash;
//# sourceMappingURL=index.js.map