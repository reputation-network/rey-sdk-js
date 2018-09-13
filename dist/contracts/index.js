"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = __importDefault(require("./registry"));
exports.default = registry_1.default;
function DevelopmentContract() {
    return new registry_1.default("http://localhost:8545", "0x556ED3bEaF6b3dDCb1562d3F30f79bF86fFC05B9");
}
exports.DevelopmentContract = DevelopmentContract;
//# sourceMappingURL=index.js.map