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
const web3_eth_contract_1 = __importDefault(require("web3-eth-contract"));
class RegistryContract {
    constructor(provider, address, options) {
        this.ABI = require("./abi").default;
        web3_eth_contract_1.default.setProvider(provider);
        this.registry = new web3_eth_contract_1.default(this.ABI, address, options);
    }
    getEntry(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.registry.methods.getEntry(address).call();
            return { url: result[0], hash: result[1] };
        });
    }
    setEntry(address, entry) {
        return this.registry.methods.setEntry(entry.url, entry.hash).send({ from: address });
    }
}
exports.default = RegistryContract;
//# sourceMappingURL=index.js.map