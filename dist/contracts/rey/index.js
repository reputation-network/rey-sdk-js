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
class ReyContract {
    constructor(provider, address, options) {
        this.ABI = require("./abi").default;
        web3_eth_contract_1.default.setProvider(provider);
        this.contract = new web3_eth_contract_1.default(this.ABI, address, options);
    }
    validateRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const arg = request.toABI();
            return this.contract.methods.validateRequest(arg).call();
        });
    }
    getPastTransactions(subject) {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME fromBlock should be rey creation
            const events = yield this.contract.getPastEvents("Cashout", { fromBlock: 0, filter: { subject } });
            return events.map((event) => event.returnValues.transaction); // TODO paginate
        });
    }
    cashout(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("This method is not yet implemented");
        });
    }
    fund(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("This method is not yet implemented");
        });
    }
    release(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("This method is not yet implemented");
        });
    }
    balance(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("This method is not yet implemented");
        });
    }
}
exports.default = ReyContract;
//# sourceMappingURL=index.js.map