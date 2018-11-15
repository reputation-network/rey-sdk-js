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
const factory_1 = require("../structs/factory");
const client_1 = __importDefault(require("./client"));
const encryption_key_1 = __importDefault(require("./encryption-key"));
const params_1 = __importDefault(require("./params"));
function buildEncryptionKey(encryptionKey, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const sign = factory_1.buildSignStrategyByActor(signStrategy);
        encryptionKey = encryptionKey || encryption_key_1.default.buildUnsigned();
        return factory_1.build(encryption_key_1.default, Object.assign({}, encryptionKey), sign.reader);
    });
}
exports.buildEncryptionKey = buildEncryptionKey;
function buildAppParams(appParams, signStrategy) {
    return __awaiter(this, void 0, void 0, function* () {
        const [request, extraReadPermissions, encryptionKey] = yield Promise.all([
            factory_1.buildRequest(appParams.request, signStrategy),
            Promise.all(appParams.extraReadPermissions
                .map((rp) => factory_1.buildReadPermission(rp, signStrategy))),
            buildEncryptionKey(appParams.encryptionKey, signStrategy),
        ]);
        return new params_1.default({ request, extraReadPermissions, encryptionKey });
    });
}
exports.buildAppParams = buildAppParams;
function buildAppClient(address, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return new client_1.default(address, opts);
    });
}
exports.buildAppClient = buildAppClient;
//# sourceMappingURL=factory.js.map