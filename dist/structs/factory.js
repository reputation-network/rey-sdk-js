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
const utils_1 = require("../utils");
const signature_1 = require("../utils/signature");
const proof_1 = __importDefault(require("./proof"));
const read_permission_1 = __importDefault(require("./read-permission"));
const request_1 = __importDefault(require("./request"));
const session_1 = __importDefault(require("./session"));
const transaction_1 = __importDefault(require("./transaction"));
const write_permission_1 = __importDefault(require("./write-permission"));
function build(clazz, payload, sign) {
    return __awaiter(this, void 0, void 0, function* () {
        let signature = (payload || {}).signature || signature_1.dummySignature();
        const t = new clazz(Object.assign({}, payload, { signature }));
        if (!signature || signature_1.isDummySignature(signature)) {
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
        const signBy = buildSignStrategyByActor(signStrategy);
        return build(read_permission_1.default, readPermission, signBy.subject);
    });
}
exports.buildReadPermission = buildReadPermission;
function buildSession(session, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signBy = buildSignStrategyByActor(signStrategy);
        return build(session_1.default, session, signBy.subject);
    });
}
exports.buildSession = buildSession;
function buildWritePermission(writePermission, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signBy = buildSignStrategyByActor(signStrategy);
        return build(write_permission_1.default, writePermission, signBy.subject);
    });
}
exports.buildWritePermission = buildWritePermission;
function buildRequest(req, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signBy = buildSignStrategyByActor(signStrategy);
        const [readPermission, session] = yield Promise.all([
            buildReadPermission(req.readPermission, signBy.subject),
            buildSession(req.session, signBy.subject),
        ]);
        return build(request_1.default, Object.assign({}, req, { readPermission, session }), signBy.reader);
    });
}
exports.buildRequest = buildRequest;
function buildProof(proof, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signBy = buildSignStrategyByActor(signStrategy);
        const [writePermission, session] = yield Promise.all([
            buildWritePermission(proof.writePermission, signBy.subject),
            buildSession(proof.session, signBy.subject),
        ]);
        return build(proof_1.default, Object.assign({}, proof, { writePermission, session }), signBy.writer);
    });
}
exports.buildProof = buildProof;
function buildTransaction(transaction, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const signBy = buildSignStrategyByActor(signStrategy);
        const [request, proof] = yield Promise.all([
            buildRequest(transaction.request, signStrategy),
            buildProof(transaction.proof, signStrategy),
        ]);
        return build(transaction_1.default, Object.assign({}, transaction, { request, proof }), signBy.verifier);
    });
}
exports.buildTransaction = buildTransaction;
exports.default = {
    build,
    buildReadPermission,
    buildSession,
    buildWritePermission,
    buildRequest,
    buildProof,
    buildTransaction,
};
//# sourceMappingURL=factory.js.map