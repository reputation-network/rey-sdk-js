"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = __importDefault(require("./registry"));
const rey_1 = __importDefault(require("./rey"));
function SmartContract(provider, address, options) {
    const registry = new registry_1.default(provider, typeof address === "string" ? address : address.registry, options);
    const rey = new rey_1.default(provider, typeof address === "string" ? address : address.rey, options);
    return new Proxy({}, {
        get(target, prop, receiver) {
            if (Reflect.has(rey, prop)) {
                return Reflect.get(rey, prop, receiver);
            }
            else if (Reflect.has(registry, prop)) {
                return Reflect.get(registry, prop, receiver);
            }
            else {
                return undefined;
            }
        },
    });
}
exports.default = SmartContract;
function DevelopmentContract(options) {
    return SmartContract("http://localhost:8545", {
        registry: "0x556ED3bEaF6b3dDCb1562d3F30f79bF86fFC05B9",
        rey: "0x76C19376b275A5d77858c6F6d5322311eEb92cf5",
    }, options);
}
exports.DevelopmentContract = DevelopmentContract;
function TestnetContract(provider, options) {
    return SmartContract(provider, {
        registry: "0xC05f9be01592902e133F398998E783b6cbD93813",
        rey: "0xF4f8787A17aBF8011Aef72dEa64bFBA1993E7F38",
    }, options);
}
exports.TestnetContract = TestnetContract;
//# sourceMappingURL=index.js.map