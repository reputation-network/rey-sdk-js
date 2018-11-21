"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Address = __importStar(require("./constants"));
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
        registry: Address.DEVELOPMENT_REGISTRY_CONTRACT_ADDRESS,
        rey: Address.DEVELOPMENT_REY_CONTRACT_ADDRESS,
    }, options);
}
exports.DevelopmentContract = DevelopmentContract;
function TestnetContract(provider, options) {
    return SmartContract(provider, {
        registry: Address.RINKEBY_REGISTRY_CONTRACT_ADDRESS,
        rey: Address.RINKEBY_REY_CONTRACT_ADDRESS,
    }, options);
}
exports.TestnetContract = TestnetContract;
//# sourceMappingURL=index.js.map