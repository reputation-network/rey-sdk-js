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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_buffer_1 = require("safe-buffer");
const soliditySha3_1 = __importDefault(require("web3-utils/src/soliditySha3"));
const structs_1 = require("../structs");
const utils = __importStar(require("../utils"));
/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
function buildToken(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = yield buildTokenPayload(opts);
        return buildUnsignedJwt(payload);
    });
}
exports.buildToken = buildToken;
/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy.
 *
 * The jwt payload WILL NOT BE a proper Request. Instead it will have a hash
 * claim instead of signature. Hash is the value to be signed and added to the payload
 * by the reader for it to be valid JWT.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
function buildTokenWithHash(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = yield buildTokenPayload(opts);
        const payloadWithHash = Object.assign({}, payload, { request: Object.assign({}, payload.request, { signature: null, hash: soliditySha3_1.default(...utils.recoverSignatureSeed(payload.request)) }) });
        return buildUnsignedJwt(payloadWithHash);
    });
}
exports.buildTokenWithHash = buildTokenWithHash;
/**
 * Returns a promise that resolves into an AppAccess AFTER signing readPermission,
 * session and extraReadPermissions have been signed with the provided sign strategy.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
function buildTokenPayload(o) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = validateOpts(o);
        const signature = utils.dummySignature();
        const request = new structs_1.Request(Object.assign({}, opts.request, { readPermission: Object.assign({}, opts.request.readPermission, { signature }), session: Object.assign({}, opts.request.session, { signature }), signature }));
        const signedExtraReadPermissionsProm = opts.extraReadPermissions.map((rp) => {
            const unsignedRp = new structs_1.ReadPermission(Object.assign({}, rp, { signature: utils.dummySignature() }));
            return utils.signAgain(unsignedRp, opts.subjectSignStrategy);
        });
        const [readPermission, session, extraReadPermissions] = yield Promise.all([
            utils.signAgain(request.readPermission, opts.subjectSignStrategy),
            utils.signAgain(request.session, opts.subjectSignStrategy),
            Promise.all(signedExtraReadPermissionsProm),
        ]);
        const signedRequest = yield utils.signAgain(new structs_1.Request(Object.assign({}, request, { readPermission, session })), opts.readerSignStrategy);
        return new structs_1.AppParams({ request: signedRequest, extraReadPermissions });
    });
}
exports.buildTokenPayload = buildTokenPayload;
/**
 * Statically validates the provided opts and returns a safe to use version.
 * @param opts
 * @throws {TypeError} if there is an error with the opts values.
 */
function validateOpts(opts) {
    // TODO: Implement, do the js typechecing
    return Object.assign({
        subjectSignStrategy: () => utils.dummySignature(),
        readerSignStrategy: () => utils.dummySignature(),
    }, opts);
}
/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
function base64url(data) {
    return safe_buffer_1.Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
function buildUnsignedJwt(payload) {
    const headers = { typ: "JWT", alg: "none" };
    const parts = [headers, payload, ""];
    return parts.map((p) => p ? base64url(p) : "").join(".");
}
//# sourceMappingURL=token.js.map