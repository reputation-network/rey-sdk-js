"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_eth_contract_1 = __importDefault(require("web3-eth-contract"));
class RegistryContract {
    constructor(provider, address) {
        this.ABI = require("./abi");
        web3_eth_contract_1.default.setProvider(provider);
        this.registry = new web3_eth_contract_1.default(this.ABI, address);
    }
    getEntry(address) {
        return this.registry.methods.getEntry(address).call();
    }
    setEntry(address, manifestUrl) {
        return this.registry.methods.setEntry(manifestUrl).send({ from: address });
    }
}
exports.default = RegistryContract;
//# sourceMappingURL=index.js.map