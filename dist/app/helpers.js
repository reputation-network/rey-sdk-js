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
const structs_1 = require("../structs");
const utils_1 = require("../utils");
function lazySignEntity(entity, Entity, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        if (entity && !entity.signature && signStrategy) {
            entity = yield utils_1.signAgain(new Entity(Object.assign({}, entity, { signature: utils_1.dummySignature() })), signStrategy, Entity);
        }
        return new Entity(entity);
    });
}
exports.lazySignEntity = lazySignEntity;
function buildAppParams(partialAppParams, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let { request, extraReadPermissions } = partialAppParams;
        const readPermission = yield lazySignEntity(request.readPermission, structs_1.ReadPermission, opts.subjectSignStrategy);
        const session = yield lazySignEntity(request.session, structs_1.Session, opts.subjectSignStrategy);
        const req = yield lazySignEntity(Object.assign({}, request, { readPermission, session }), structs_1.Request, opts.readerSignStrategy);
        const extraRp = yield Promise.all(extraReadPermissions.map((rp) => lazySignEntity(rp, structs_1.ReadPermission, opts.subjectSignStrategy)));
        return new structs_1.AppParams({
            request: new structs_1.Request(req),
            extraReadPermissions: extraRp,
        });
    });
}
exports.buildAppParams = buildAppParams;
function buildAppParamsWithHash(partialAppParams, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const appParams = yield buildAppParams(partialAppParams, opts);
        return Object.assign({}, appParams, { request: Object.assign({}, appParams.request, { hash: utils_1.reyHash(appParams.request.toABI()) }) });
    });
}
exports.buildAppParamsWithHash = buildAppParamsWithHash;
//# sourceMappingURL=helpers.js.map