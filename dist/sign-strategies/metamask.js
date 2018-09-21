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
/**
 * Delegates the sign process into the metamask browser addon
 * @param data Data to be signed
 * @throws {TypeError} if no metamask instance is found on the window context
 */
function metamaskSign(...data) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = yield getMetamaskProvider();
        const accounts = yield getAccounts(provider);
        if (accounts.length === 0) {
            throw new Error("No accounts found on metamask");
        }
        const msg = utils_1.reyHash(data);
        return signTypedData(provider, [{ type: "bytes", name: "REY Signature", value: msg }], accounts[0]);
    });
}
exports.default = metamaskSign;
function getMetamaskProvider() {
    const w = window; // This allows us to inspect the window ignoring the typescript typechecking
    if (!w.web3 || !w.web3.currentProvider) {
        throw new TypeError("no global web3 provider found");
    }
    else if (w.web3.currentProvider.isMetaMask !== true) {
        throw new TypeError("global web3 provider is not MetaMask");
    }
    return Promise.resolve(w.web3.currentProvider);
}
function sendAsync(provider, methodCall) {
    return new Promise((resolve, reject) => {
        provider.sendAsync(methodCall, (err, res) => err ? reject(err) : resolve(res.result));
    });
}
function getAccounts(provider) {
    return sendAsync(provider, {
        method: "eth_accounts",
        params: [],
    });
}
function signTypedData(provider, data, from) {
    return sendAsync(provider, {
        method: "eth_signTypedData",
        params: [data, from],
        from,
    });
}
//# sourceMappingURL=metamask.js.map