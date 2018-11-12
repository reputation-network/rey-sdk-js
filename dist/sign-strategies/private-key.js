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
const utils_1 = require("../utils");
/**
 * Returns a sign strategy that signs data with the provided privateKey
 * @param privateKey
 */
function privateKeySignStrategyFactory(privateKey) {
    const accounts = new web3_eth_accounts_1.default();
    const account = accounts.privateKeyToAccount(privateKey);
    return (...data) => __awaiter(this, void 0, void 0, function* () {
        const msg = utils_1.reyHash(data);
        const { signature } = account.sign(msg);
        return signature;
    });
}
exports.default = privateKeySignStrategyFactory;
//# sourceMappingURL=private-key.js.map