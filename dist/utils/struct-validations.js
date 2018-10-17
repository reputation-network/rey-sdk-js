"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const web3_eth_accounts_1 = __importDefault(require("web3-eth-accounts"));
const web3_utils_1 = require("web3-utils");
const index_1 = require("./index");
/**
 * Validates that the given signature has been produced by signer
 * signing the provided data.
 * @param data Data that was signed by signer and generated signature
 * @param signature The signature of the data, produced by signer
 * @param signer The address of the signer
 * @throws {Error} if cant recover a signer from the given signature/data
 * @throws {Error} if recovered signer and provided signer don't match
 */
function validateSignature(data, signature, signer) {
    const accounts = new web3_eth_accounts_1.default();
    const rpcSignature = index_1.toRpcSignature(signature);
    const recoveredSigner = accounts.recover(data, rpcSignature);
    assert_1.default(recoveredSigner === web3_utils_1.toChecksumAddress(signer), `recovered signer was ${recoveredSigner} instead of ${signer}`);
}
exports.validateSignature = validateSignature;
/**
 * Validates the provided read permission
 * @throws {Error} expiration value is a past timestamp
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by subject
 */
function validateReadPermission(rp) {
    assert_1.default(Number(rp.expiration) > Math.floor(Date.now() / 1000), `read permission is expired`);
    try {
        const rpHash = index_1.reyHash(index_1.recoverSignatureSeed(rp));
        validateSignature(rpHash, rp.signature, rp.subject);
    }
    catch (e) {
        throw new Error(`read permission signature error: ${e.message || e}`);
    }
}
exports.validateReadPermission = validateReadPermission;
/**
 * Validates the provided session
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by subject
 */
function validateSession(session) {
    try {
        const sHash = index_1.reyHash(index_1.recoverSignatureSeed(session));
        validateSignature(sHash, session.signature, session.subject);
    }
    catch (e) {
        throw new Error(`session signature error: ${e.message || e}`);
    }
}
exports.validateSession = validateSession;
/**
 * Validates the provided request
 * @throws {Error} readPermission is not valid (see {@link validateReadPermission})
 * @throws {Error} session is not valid (see {@link validateSession})
 * @throws {Error} signature is not valid
 * @throws {Error} signature has not been generated by readPermission.reader
 */
function validateRequest(req) {
    validateReadPermission(req.readPermission);
    validateSession(req.session);
    assert_1.default(req.session.subject === req.readPermission.subject, `read permissions subject(${req.readPermission.subject}) is different from sesison subject ${req.session.subject}`);
    try {
        const reqHash = index_1.reyHash(index_1.recoverSignatureSeed(req));
        validateSignature(reqHash, req.signature, req.readPermission.reader);
    }
    catch (e) {
        throw new Error(`request signature error: ${e.message || e}`);
    }
}
exports.validateRequest = validateRequest;
//# sourceMappingURL=struct-validations.js.map