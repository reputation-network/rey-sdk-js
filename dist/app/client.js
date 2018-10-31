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
const safe_buffer_1 = require("safe-buffer");
const web3_utils_1 = require("web3-utils");
const contracts_1 = require("../contracts");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const struct_validations_1 = require("../utils/struct-validations");
class AppClient {
    constructor(address, opts = {}) {
        this.address = address;
        this.opts = buildOptions(opts);
    }
    manifestEntry(address = this.address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.opts.manifestEntryCache.has(address)) {
                return this.opts.manifestEntryCache.get(address);
            }
            const entry = yield this.opts.contract.getEntry(address);
            if (entry && entry.url) {
                this.opts.manifestEntryCache.set(address, entry);
                return entry;
            }
            else {
                throw new Error(`No manifest entry found for ${address}`);
            }
        });
    }
    manifest(address = this.address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.opts.manifestCache.has(address)) {
                return this.opts.manifestCache.get(address);
            }
            const entry = yield this.manifestEntry(address);
            const manifest = yield this.getManifest(entry);
            // FIXME: Check `manifest` actually implements the AppManifest interface
            this.opts.manifestCache.set(address, manifest);
            return manifest;
        });
    }
    extraReadPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const manifestEntry = yield this.manifestEntry();
            const manifest = yield this.manifest();
            if (!manifest) {
                throw new Error(`Could not retrieve manifest for app ${this.address}`);
            }
            const directDependencies = manifest.app_dependencies.map((dep) => {
                return { reader: manifest.address, source: dep,
                    manifest: manifestEntry.hash };
            });
            const childDependencies = yield Promise.all(
            // FIXME: There is a risk of infinite recursion error here,
            //        handle using client cache
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
            const manifest = yield this.manifest(params.request.session.verifier);
            const appReadToken = utils_2.encodeUnsignedJwt(params);
            if (!manifest.verifier_url) {
                throw new Error(`Missing verifier_url for address ${manifest.address}`);
            }
            const res = yield this.opts.http.get(manifest.verifier_url, {
                headers: { authorization: `bearer ${appReadToken}` },
            });
            if (params.encryptionKey) { // FIXME: Make encryption mandatory once encryption key is required
                const signatureHeader = res.headers["x-app-signature"];
                if (!signatureHeader) {
                    throw new Error("Missing app signature in response");
                }
                const signature = JSON.parse(safe_buffer_1.Buffer.from(signatureHeader, "base64").toString());
                struct_validations_1.validateSignature(utils_1.reyHash([res.data]), utils_1.normalizeSignature(signature), params.request.readPermission.source);
                return params.encryptionKey.decrypt(res.data);
            }
            return res.data;
        });
    }
    getManifest(manifestEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.opts.http.get(manifestEntry.url, { responseType: "arraybuffer" });
            const dataBuffer = safe_buffer_1.Buffer.from(res.data);
            const responseHash = web3_utils_1.sha3(dataBuffer);
            if (responseHash !== manifestEntry.hash) {
                throw new Error(`Manifest hash check failed for ${manifestEntry.url}`);
            }
            try {
                return JSON.parse(dataBuffer.toString("utf8"));
            }
            catch (e) {
                throw new Error(`Manifest parsing failed for ${manifestEntry.url}`);
            }
        });
    }
}
exports.default = AppClient;
function buildOptions(opts) {
    return Object.assign({
        http: axios_1.default.create(),
        manifestEntryCache: new Map(),
        manifestCache: new Map(),
        contract: contracts_1.DevelopmentContract(),
    }, opts);
}
exports.buildOptions = buildOptions;
//# sourceMappingURL=client.js.map