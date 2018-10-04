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
const web3_eth_personal_1 = __importDefault(require("web3-eth-personal"));
const utils_1 = require("../utils");
/**
 * Uses the given provider to personally sign data. If no account address provider
 * is passed, it will use the first account available. If no password provider is
 * passed, password defaults to an empty string.
 * @param provider
 * @param account
 * @param password
 */
function EthPersonalSignStrategy(provider, account = "", password = "") {
    const personal = new web3_eth_personal_1.default(provider);
    return (...data) => __awaiter(this, void 0, void 0, function* () {
        const acc = yield (account
            ? getAsync(account)
            : personal.getAccounts().then((a) => a[0]));
        const pswd = yield getAsync(password, acc);
        const message = utils_1.reyHash(data);
        const signature = yield personal.sign(message, acc, pswd);
        return signature;
    });
}
exports.default = EthPersonalSignStrategy;
function getAsync(provider, ...providerArgs) {
    return typeof provider === "function"
        ? Promise.resolve(provider())
        : Promise.resolve(provider);
}
//# sourceMappingURL=eth-personal.js.map