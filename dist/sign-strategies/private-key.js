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
const web3_eth_accounts_1 = __importDefault(require("web3-eth-accounts"));
const soliditySha3_1 = __importDefault(require("web3-utils/src/soliditySha3"));
const utils_1 = require("../utils");
/**
 * Returns a sign strategy that signs data with the provided privateKey
 * @param privateKey
 */
function privateKeySignStrategy(privateKey) {
    const accounts = new web3_eth_accounts_1.default();
    const account = accounts.fromPrivateKey(privateKey);
    return (...data) => __awaiter(this, void 0, void 0, function* () {
        const { signature } = account.sign(soliditySha3_1.default(...utils_1.deepFlatten(data)));
        return signature;
    });
}
exports.default = privateKeySignStrategy;
//# sourceMappingURL=private-key.js.map