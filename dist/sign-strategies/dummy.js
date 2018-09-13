"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function dummySignStrategyFactory() {
    return () => Promise.resolve(utils_1.dummySignature());
}
exports.default = dummySignStrategyFactory;
//# sourceMappingURL=dummy.js.map