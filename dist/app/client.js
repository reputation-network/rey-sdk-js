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
const axios_1 = __importDefault(require("axios"));
const contracts_1 = require("../contracts");
const utils_1 = require("../utils");
class AppClient {
    constructor(address, opts = {}) {
        this.address = address;
        this.opts = buildOptions(opts);
    }
    manifest() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.opts.manifestCache.has(this.address)) {
                return this.opts.manifestCache.get(this.address);
            }
            const manifestUrl = yield this.opts.contract.getEntry(this.address);
            if (!manifestUrl) {
                return null;
            }
            const res = yield this.opts.http.get(manifestUrl);
            const manifest = res.data;
            // FIXME: Check `manifest` actually implements the AppManifest interface
            this.opts.manifestCache.set(this.address, manifest);
            return manifest;
        });
    }
    extraReadPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const manifest = yield this.manifest();
            if (!manifest) {
                throw new Error(`No manifest record found for ${this.address}`);
            }
            const directDependencies = manifest.app_dependencies.map((dep) => ({ reader: manifest.address, source: dep }));
            const childDependencies = yield Promise.all(
            // FIXME: There is a risk of infinite recursion error here,
            //        should we handle that scenario? how?
            manifest.app_dependencies.map((dep) => {
                const depClient = new AppClient(dep, this.opts);
                return depClient.extraReadPermissions();
            }));
            return [
                ...directDependencies,
                ...(childDependencies.reduce((v, c) => v.concat(c), [])),
            ];
        });
    }
    query(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifest = yield this.manifest();
            if (!manifest) {
                throw new Error(`No manifest record found for ${this.address}`);
            }
            const appReadToken = utils_1.encodeUnsignedJwt(params);
            const res = yield this.opts.http.get(manifest.app_url, {
                headers: { authorization: `bearer ${appReadToken}` },
            });
            return res.data;
        });
    }
}
exports.default = AppClient;
function buildOptions(opts) {
    return Object.assign({
        http: axios_1.default.create(),
        manifestCache: new Map(),
        contract: contracts_1.DevelopmentContract(),
    }, opts);
}
exports.buildOptions = buildOptions;
//# sourceMappingURL=client.js.map