"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function MetamaskPersonalSignStrategy() {
    const web3CurrentProvider = getMetamaskProvider();
    return (...data) => __awaiter(this, void 0, void 0, function* () {
        const account = (yield getAccounts(web3CurrentProvider))[0];
        if (!account) {
            throw new Error("No default account selected for metamask");
        }
        const msg = utils_1.reyHash(data);
        return personalSign(web3CurrentProvider, msg, account);
    });
}
exports.default = MetamaskPersonalSignStrategy;
function getMetamaskProvider() {
    const w = window; // This allows us to inspect the window ignoring the typescript typechecking
    if (!w.web3 || !w.web3.currentProvider) {
        throw new TypeError("no global web3 provider found");
    }
    else if (w.web3.currentProvider.isMetaMask !== true) {
        throw new TypeError("global web3 provider is not MetaMask");
    }
    return w.web3.currentProvider;
}
function getAccounts(provider) {
    return sendAsync(provider, {
        method: "eth_accounts",
        params: [],
    });
}
function personalSign(provider, data, from) {
    return sendAsync(provider, {
        method: "personal_sign",
        params: [data, from],
    });
}
function sendAsync(provider, methodCall) {
    return new Promise((resolve, reject) => {
        provider.sendAsync(methodCall, (err, res) => err ? reject(err) : resolve(res.result));
    });
}
//# sourceMappingURL=metamask.js.map