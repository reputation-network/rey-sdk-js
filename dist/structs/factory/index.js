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
const utils_1 = require("../../utils");
const encryption_key_1 = __importDefault(require("../../utils/encryption-key"));
const app_params_1 = __importDefault(require("../app-params"));
const proof_1 = __importDefault(require("../proof"));
const read_permission_1 = __importDefault(require("../read-permission"));
const request_1 = __importDefault(require("../request"));
const session_1 = __importDefault(require("../session"));
const write_permission_1 = __importDefault(require("../write-permission"));
const signerByEntity = new WeakMap([
    [proof_1.default, "writer"],
    [read_permission_1.default, "subject"],
    [request_1.default, "reader"],
    [session_1.default, "subject"],
    [write_permission_1.default, "subject"],
]);
function build(clazz, payload, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signer = signerByEntity.get(clazz);
        if (!signer) {
            throw new Error(`Couldn't determine signer for class ${clazz}[${clazz.name}]`);
        }
        const signBy = buildSignStrategyByActor(signStrategy);
        const sign = signBy[signer];
        let signature = (payload || {}).signature || utils_1.dummySignature();
        const t = new clazz(Object.assign({}, payload, { signature }));
        if (!signature || utils_1.toRpcSignature(signature) === utils_1.toRpcSignature(utils_1.dummySignature())) {
            signature = yield sign(...utils_1.recoverSignatureSeed(t));
        }
        return new clazz(Object.assign({}, t, { signature }));
    });
}
exports.build = build;
function buildSignStrategyByActor(o) {
    const coarce = (name) => {
        if (typeof o === "object" && typeof o[name] === "function") {
            return o[name];
        }
        else if (typeof o === "object" && typeof o.default === "function") {
            return o.default;
        }
        else if (typeof o === "function") {
            return o;
        }
        else {
            throw new TypeError(`Could not find suitable ${name} sign strategy in ${o}`);
        }
    };
    return Object.defineProperties({}, {
        default: { get: () => coarce("default") },
        subject: { get: () => coarce("subject") },
        source: { get: () => coarce("source") },
        reader: { get: () => coarce("reader") },
        verifier: { get: () => coarce("verifier") },
        writer: { get: () => coarce("writer") },
    });
}
exports.buildSignStrategyByActor = buildSignStrategyByActor;
function buildReadPermission(readPermission, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        return build(read_permission_1.default, readPermission, signStrategy);
    });
}
exports.buildReadPermission = buildReadPermission;
function buildSession(session, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        return build(session_1.default, session, signStrategy);
    });
}
exports.buildSession = buildSession;
function buildWritePermission(writePermission, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        return build(write_permission_1.default, writePermission, signStrategy);
    });
}
exports.buildWritePermission = buildWritePermission;
function buildRequest(req, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const [readPermission, session] = yield Promise.all([
            buildReadPermission(req.readPermission, signStrategy),
            buildSession(req.session, signStrategy),
        ]);
        return build(request_1.default, Object.assign({}, req, { readPermission, session }), signStrategy);
    });
}
exports.buildRequest = buildRequest;
function buildProof(proof, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const [writePermission, session] = yield Promise.all([
            buildWritePermission(proof.writePermission, signStrategy),
            buildSession(proof.session, signStrategy),
        ]);
        return build(proof_1.default, Object.assign({}, proof, { writePermission, session }), signStrategy);
    });
}
exports.buildProof = buildProof;
function buildEncryptionKey(encryptionKey, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        return build(encryption_key_1.default, encryptionKey, signStrategy);
    });
}
exports.buildEncryptionKey = buildEncryptionKey;
function buildAppParams(appParams, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const [request, extraReadPermissions] = yield Promise.all([
            buildRequest(appParams.request, signStrategy),
            Promise.all(appParams.extraReadPermissions
                .map((rp) => buildReadPermission(rp, signStrategy))),
        ]);
        return new app_params_1.default({ request, extraReadPermissions });
    });
}
exports.buildAppParams = buildAppParams;
exports.default = {
    build,
    buildReadPermission,
    buildSession,
    buildWritePermission,
    buildRequest,
    buildProof,
    buildAppParams,
};
//# sourceMappingURL=index.js.map